import { User, Phone } from 'lucide-react';
import './CustomerForm.css';

function CustomerForm({ customer, onCustomerChange }) {
    const handleNameChange = (e) => {
        onCustomerChange({ ...customer, name: e.target.value });
    };

    const handlePhoneChange = (e) => {
        // Allow only numbers, limit to 10 digits
        const value = e.target.value.replace(/\D/g, '').slice(0, 10);
        onCustomerChange({ ...customer, phone: value });
    };

    return (
        <div className="customer-form">
            <div className="form-title">Customer Details</div>
            <div className="form-fields">
                <div className="input-group">
                    <div className="input-icon">
                        <User size={18} />
                    </div>
                    <input
                        type="text"
                        className="input"
                        placeholder="Customer Name"
                        value={customer.name}
                        onChange={handleNameChange}
                    />
                </div>
                <div className="input-group">
                    <div className="input-icon">
                        <Phone size={18} />
                    </div>
                    <input
                        type="tel"
                        className="input"
                        placeholder="Phone Number (Optional)"
                        value={customer.phone}
                        onChange={handlePhoneChange}
                        maxLength={10}
                    />
                </div>
            </div>
        </div>
    );
}

export default CustomerForm;
