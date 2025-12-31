import { X, Printer, CheckCircle, Plus } from 'lucide-react';
import './OrderSummary.css';

// Convert number to words (Indian format)
const numberToWords = (num) => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
        'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    if (num === 0) return 'Zero';
    if (num < 20) return ones[num];
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '');
    if (num < 1000) return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 ? ' ' + numberToWords(num % 100) : '');
    if (num < 100000) return numberToWords(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 ? ' ' + numberToWords(num % 1000) : '');
    if (num < 10000000) return numberToWords(Math.floor(num / 100000)) + ' Lakh' + (num % 100000 ? ' ' + numberToWords(num % 100000) : '');
    return numberToWords(Math.floor(num / 10000000)) + ' Crore' + (num % 10000000 ? ' ' + numberToWords(num % 10000000) : '');
};

function OrderSummary({ order, onClose, onNewOrder }) {
    const subtotal = order.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalItems = order.cart.reduce((sum, item) => sum + item.quantity, 0);
    const total = subtotal; // No GST for this format

    // Check if this is an update with already paid items
    const isUpdate = order.isUpdate && order.alreadyPaidItems && order.alreadyPaidItems.length > 0;
    const alreadyPaidTotal = order.alreadyPaidTotal || 0;
    const needToPay = total - alreadyPaidTotal;

    // Generate bill number from order ID
    const getBillNo = () => {
        const match = order.orderId?.match(/\d+/);
        return match ? `B-${match[0].slice(-4)}` : 'B-0000';
    };

    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }).replace(/\//g, '-');
    };

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
        });
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="order-overlay">
            <div className="order-modal">
                {/* Modal Header - Hide on Print */}
                <div className="modal-header no-print">
                    <div className="success-badge">
                        <CheckCircle size={20} />
                        <span>{isUpdate ? 'Bill Updated' : 'Order Confirmed'}</span>
                    </div>
                    <button className="btn btn-ghost btn-icon" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                {/* Compact Invoice - Thermal Printer Format */}
                <div className="invoice compact-bill" id="invoice-print">
                    {/* Company Header */}
                    <div className="bill-header">
                        <div className="company-name">SRI KALKI JAM JAM RESORTS</div>
                        <div className="company-address">17/A, Kalki Nagar,</div>
                        <div className="company-address">Velampalayam, Kavundapadi,</div>
                        <div className="company-address">Erode - 638455. Tamil Nadu.</div>
                        <div className="company-gstin">GSTIN : 33AFBFS6465F1ZZ</div>
                        <div className="company-mobile">Mobile : 9442917999</div>
                        <div className="company-email">Email : srikalkijamjamresorts@gmail.com</div>
                        <div className="company-website">Website : www.srikalkijamjamresorts.com</div>
                    </div>

                    <div className="bill-divider"></div>

                    {/* Bill Info */}
                    <div className="bill-info">
                        <div className="bill-row">
                            <span>B.No: {getBillNo()}</span>
                            <span>Date: {formatDate(order.timestamp)}</span>
                        </div>
                        <div className="bill-row">
                            <span></span>
                            <span>Time: {formatTime(order.timestamp)}</span>
                        </div>
                    </div>

                    <div className="bill-customer">
                        <div>To   : {order.customer?.name || 'Cash Sales'}</div>
                        <div>State Name:TamilNadu</div>
                        <div>State Code:33</div>
                    </div>

                    <div className="bill-divider-dashed"></div>

                    {/* Items Table Header */}
                    <div className="bill-table-header">
                        <span className="col-name">ITEM NAME</span>
                        <span className="col-qty">QTY</span>
                        <span className="col-rate">RATE</span>
                        <span className="col-amt">AMOUNT</span>
                    </div>

                    <div className="bill-divider-thin"></div>

                    {/* Items */}
                    <div className="bill-items">
                        {order.cart.map((item, idx) => (
                            <div key={idx} className="bill-item-row">
                                <span className="col-name">{item.name}</span>
                                <span className="col-qty">{item.quantity}</span>
                                <span className="col-rate">{item.price.toFixed(2)}</span>
                                <span className="col-amt">{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="bill-divider-thin"></div>

                    {/* Subtotal */}
                    <div className="bill-subtotal">
                        <span className="col-name"></span>
                        <span className="col-qty">{totalItems}</span>
                        <span className="col-rate"></span>
                        <span className="col-amt">{subtotal.toFixed(2)}</span>
                    </div>

                    <div className="bill-divider-dashed"></div>

                    {/* Grand Total */}
                    <div className="bill-total">
                        <span className="total-label">GRAND TOTAL :</span>
                        <span className="total-value">{total.toFixed(2)}</span>
                    </div>

                    <div className="bill-words">
                        {numberToWords(Math.round(total))} Only
                    </div>

                    {/* Already Paid & Need to Pay - Only show for updates */}
                    {isUpdate && needToPay > 0 && (
                        <>
                            <div className="bill-divider-dashed"></div>

                            <div className="bill-payment-section">
                                <div className="bill-payment-row already-paid">
                                    <span>Already Paid :</span>
                                    <span>{alreadyPaidTotal.toFixed(2)}</span>
                                </div>
                                <div className="bill-payment-row need-to-pay">
                                    <span>NEED TO PAY :</span>
                                    <span className="need-to-pay-amount">{needToPay.toFixed(2)}</span>
                                </div>
                                <div className="bill-words need-to-pay-words">
                                    {numberToWords(Math.round(needToPay))} Only
                                </div>
                            </div>
                        </>
                    )}

                    <div className="bill-divider-dashed"></div>

                    {/* Footer */}
                    <div className="bill-footer">
                        For SRI KALKI JAM JAM RESORTS
                    </div>
                </div>

                {/* Modal Actions - Hide on Print */}
                <div className="modal-actions no-print">
                    <button className="btn btn-secondary" onClick={handlePrint}>
                        <Printer size={18} />
                        Print Invoice
                    </button>
                    <button className="btn btn-primary" onClick={onNewOrder}>
                        <Plus size={18} />
                        New Order
                    </button>
                </div>
            </div>
        </div>
    );
}

export default OrderSummary;
