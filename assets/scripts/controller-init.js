var MoipIntegrationSample = window.MoipIntegrationSample || {};

(function() {
	'use strict';

	// Elements' selectors.
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
	 * Hide selectors.
	 * 
	 * @param {int} indexToDisplay Index of the step to display. 
	 */
	function hideSelectors(indexToDisplay) {
		for (var index = 0; index < stepSelectors.length; index++) {
			var $step = $(stepSelectors[index].step);
			if (index === indexToDisplay) {
				$step.show();
			} else {
				$step.hide();
			}
		}
	}

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
				goToStep(1, 0);
			} else {
				showMessage('Please select at least one product.');
			}
		});
	}

	/**
	 * Bind events for step 1.
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

					goToStep(2, 1);
				}
			});
		});
	}

	/**
	 * Bind events for step 1.
	 */
	function bindStep3() {
		$(stepSelectors[2].btnOrder).click(function() {
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

					$('#modal-loading').modal('show');
					checkConfirmation();
				}
			});
		});
	}

	/**
	 * Bind events for step 1.
	 */
	function bindStep4() {
		$(stepSelectors[3].btnBack).click(function() {
			location.reload(true);
		});
	}

	/**
	 * Display a message.
	 * 
	 * @param {string} message Message to display.
	 */
	function showMessage(message) {
		$('#modal-message-text').html(message);
		$('#modal-message').modal('show');
	}

	/**
	 * Go to a given step.
	 * 
	 * @param {int} indexTo Index of the step to go.
	 * @param {int} indexFrom Index of the origin step.
	 */
	function goToStep(indexTo, indexFrom) {
		$(stepSelectors[indexFrom].step).hide();
		$(stepSelectors[indexTo].step).show();
		displayCart($(stepSelectors[indexTo].table), cart);
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
					$('#modal-loading').modal('hide');
					goToStep(3, 2);
				} else {
					setTimeout(checkConfirmation, 1000);
				}
			}
		});
	}

	/**
	 * Initialize the controller.
	 */
	function init() {
		hideSelectors(0);
		bindStep1();
		bindStep2();
		bindStep3();
		bindStep4();
	};

	$(init);
})();
