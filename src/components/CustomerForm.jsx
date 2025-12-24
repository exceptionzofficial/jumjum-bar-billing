import { User, Phone, X } from 'lucide-react';
import { useState } from 'react';
import NumPad from './NumPad';
import './CustomerForm.css';

function CustomerForm({ customer, onCustomerChange }) {
    const [showNumPad, setShowNumPad] = useState(false);

    const handleNameChange = (e) => {
        onCustomerChange({ ...customer, name: e.target.value });
    };

    const handlePhoneComplete = (phone) => {
        onCustomerChange({ ...customer, phone });
        setShowNumPad(false);
    };

    const clearCustomer = () => {
        onCustomerChange({ name: '', phone: '' });
    };

    return (
        <div className="customer-form">
            <div className="customer-form-header">
                <h2>👤 Customer Details</h2>
                {(customer.name || customer.phone) && (
                    <button className="btn btn-icon btn-danger" onClick={clearCustomer} title="Clear">
                        <X size={24} />
                    </button>
                )}
            </div>

            <div className="customer-fields">
                <div className="input-group">
                    <div className="input-icon">
                        <User size={28} />
                    </div>
                    <input
                        type="text"
                        className="input"
                        placeholder="Customer Name"
                        value={customer.name}
                        onChange={handleNameChange}
                        autoComplete="off"
                    />
                </div>

                <div className="input-group">
                    <div className="input-icon">
                        <Phone size={28} />
                    </div>
                    <input
                        type="tel"
                        className="input"
                        placeholder="Phone Number"
                        value={customer.phone}
                        onFocus={() => setShowNumPad(true)}
                        readOnly
                    />
                </div>
            </div>

            {showNumPad && (
                <div className="numpad-overlay">
                    <div className="numpad-modal">
                        <NumPad
                            value={customer.phone}
                            onComplete={handlePhoneComplete}
                            onCancel={() => setShowNumPad(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default CustomerForm;
