var MoipIntegrationSample = window.MoipIntegrationSample || {};

(function() {
	'use strict';

	// Elements' selectors.
	var carouselSelector = '#carousel-steps';
	var stepSelectors = [
		{
			step: '#step1',
			quantities: '#step1 .product .input-number', //data-product-id, data-product-name
			btnBuy: '#btn-buy'
		},
		{
			step: '#step2',
			table: '#products-step2',
			form: '#form-step2',
			txtEmail: '#email',
			btnContinue: '#btn-continue'
		},
		{
			step: '#step3',
			table: '#products-step3',
			form: '#form-step3',
			lblEmail: '#lbl-email',
			txtFullname: '#fullname',
			txtBirthDate: '#birth-date',
			txtDocument: '#document',
			txtPhone: '#phone',
			txtCreditCardNumber: '#credit-card-number',
			txtCreditCardCVD: '#credit-card-cvc',
			txtCreditCardExp: '#credit-card-expiration',
			txtInstallments: '#payment-installments',
			txtDiscount: '#payment-discount-code',
			btnOrder: '#btn-order'
		},
		{
			step: '#step4',
			table: '#products-step4',
			btnBack: '#btn-back'
		}
	];

	// Products added to the cart.
	var cart = null;

	/**
	 * Bind events for step 1.
	 */
	function bindStep1() {
		$(stepSelectors[0].btnBuy).click(function() {
			var productIndex = 0;
			cart = {
				orderId: null,
				products: [],
				discounts: 0.0,
				interest: 0.0,
				total: 0.0
			};

			$(stepSelectors[0].quantities).each(function() {
				var $this = $(this);
				var quantity = parseInt($this.val());
				var price = $this.attr('data-product-price');

				if (quantity > 0) {
					cart.products[productIndex++] = {
						id: $this.attr('data-product-id'),
						name: $this.attr('data-product-name'),
						price: price,
						quantity: quantity,
						total: price * quantity
					};

					cart.total += price * quantity;
				}

			});

			if (cart.products.length > 0) {
				goToNextStep();
			} else {
				showMessage('Please select at least one product.');
			}
		});
	}

	/**
	 * Bind events for step 2.
	 */
	function bindStep2() {
		$(stepSelectors[1].btnContinue).click(function() {
			$.ajax({
				type: 'POST',
				url: '/client/get',
				contentType: 'application/json',
				dataType: 'json',
				data: JSON.stringify({ 
					email: $(stepSelectors[1].txtEmail).val() 
				}),
				success: function(data) {
					console.log('bindStep2', data);

					$(stepSelectors[1].form).trigger('reset');
					
					$(stepSelectors[2].lblEmail).html($(stepSelectors[1].txtEmail).val());

					if (data && data.length > 0) {
						$(stepSelectors[2].txtFullname).val(data[0].fullname);
						$(stepSelectors[2].txtBirthDate).val(data[0].birth_date.substring(0, 10));
						$(stepSelectors[2].txtDocument).val(data[0].document);
						$(stepSelectors[2].txtPhone).val(data[0].phone);
					}

					goToNextStep();
				},
				error: function (request, status, error) {
					console.log(status, error);
				}
			});
		});
	}

	/**
	 * Bind events for step 3.
	 */
	function bindStep3() {
		$(stepSelectors[2].btnOrder).click(function() {
			if ($(stepSelectors[2].txtDiscount).val() === '5OFF') {
				cart.discounts = cart.total * 0.05;
				cart.total -= cart.discounts;
				console.log('5OFF', cart.discounts, cart.total);
			}
			if (parseInt($(stepSelectors[2].txtInstallments).val()) > 1) {
				cart.interest = cart.total * 0.025;
				cart.total += cart.interest;
				console.log('installments > 1', cart.interest, cart.total);
			}

			var order = {
				cart: cart,
				data: $(stepSelectors[2].form).serializeArray()
			};

			$.ajax({
				type: 'POST',
				url: '/order/put',
				contentType: 'application/json',
				dataType: 'json',
				data: JSON.stringify(order),
				success: function(data) {
					cart.orderId = data.orderId;
					console.log('bindStep3', order, data);

					loading(true);
					checkConfirmation();
				},
				error: function (request, status, error) {
					console.log(status, error);
				}
			});
		});
	}

	/**
	 * Bind events for step 4.
	 */
	function bindStep4() {
		$(stepSelectors[3].btnBack).click(function() {
			location.reload(true);
		});
	}

	/**
	 * Go to the next step.
	 */
	function goToNextStep() {
		$(carouselSelector).carousel('next').carousel('pause');
	}

	/**
	 * Display cart on a table.
	 * 
	 * @param {object} table Table to display the cart.
	 * @param {object} cart Card details.
	 */
	function displayCart($table, cart) {
		var $tbody = $table.find('tbody');
		$tbody.empty();

		for (var index = 0; index < cart.products.length; index++) {
			var product = cart.products[index];
			$tbody.append('<tr>' +
					'<td>' + product.name + ' ($' + product.price + ')</td>' +
					'<td>x' + product.quantity + ' year' + (product.quantity > 1 ? 's' : '') + '</td>' +
					'<td><strong>$' + product.total + '</strong></td>' +
				'</tr>');
		}

		$table.find('tfoot .value-discounts').html('$' + cart.discounts);
		$table.find('tfoot .value-interest').html('$' + cart.interest);
		$table.find('tfoot .value-total').html('$' + cart.total);
	}

	/**
	 * Wait for order confirmation.
	 */
	function checkConfirmation() {
		$.ajax({
			type: 'POST',
			url: '/order/get',
			contentType: 'application/json',
			dataType: 'json',
			data: JSON.stringify({
				orderId: cart.orderId,
			}),
			success: function(data) {
				console.log('checkConfirmation', data);

				if (data && data.status === 1) {
					loading(false);
					goToNextStep();
				} else if (data && data.status === -1) {
					loading(false);
					showMessage(data.message);
				} else {
					setTimeout(checkConfirmation, 1000);
				}
			},
			error: function (request, status, error) {
				loading(false);
				showMessage('It was not possible to complete your order. Please try again.');
				console.log(status, error);
			}
		});
	}

	/**
	 * Display a message on a modal.
	 * 
	 * @param {string} message Message to display.
	 */
	function showMessage(message) {
		$('#modal-message-text').html(message);
		$('#modal-message').modal('show');
	}

	/**
	 * Display the loading modal.
	 * 
	 * @param {boolean} show Indicates whether the modal should be displayed.
	 */
	function loading(show) {
		$('#modal-loading').modal(show ? 'show' : 'hide');
	}

	/**
	 * Initialize the controller.
	 */
	function init() {
		bindStep1();
		bindStep2();
		bindStep3();
		bindStep4();

		$(carouselSelector).carousel('pause');
	};

	$(init);
})();
