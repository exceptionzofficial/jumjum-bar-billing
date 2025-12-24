import { Delete, Check, X } from 'lucide-react';
import { useState } from 'react';
import { formatPhoneNumber } from '../utils/formatters';
import './NumPad.css';

function NumPad({ value, onComplete, onCancel }) {
    const [phone, setPhone] = useState(value || '');

    const handleNumber = (num) => {
        if (phone.length < 10) {
            setPhone(prev => prev + num);
        }
    };

    const handleBackspace = () => {
        setPhone(prev => prev.slice(0, -1));
    };

    const handleClear = () => {
        setPhone('');
    };

    const handleSubmit = () => {
        if (phone.length >= 10) {
            onComplete(phone);
        }
    };

    const buttons = [
        '1', '2', '3',
        '4', '5', '6',
        '7', '8', '9',
        'clear', '0', 'back'
    ];

    return (
        <div className="numpad">
            <div className="numpad-header">
                <h3>📱 Enter Phone Number</h3>
                <button className="btn btn-icon" onClick={onCancel}>
                    <X size={28} />
                </button>
            </div>

            <div className="numpad-display">
                <span className="numpad-value">
                    {phone ? formatPhoneNumber(phone) : 'Enter 10 digits'}
                </span>
                <span className="numpad-count">{phone.length}/10</span>
            </div>

            <div className="numpad-grid">
                {buttons.map((btn) => {
                    if (btn === 'clear') {
                        return (
                            <button
                                key={btn}
                                className="numpad-btn numpad-btn-action"
                                onClick={handleClear}
                            >
                                <X size={32} />
                            </button>
                        );
                    }
                    if (btn === 'back') {
                        return (
                            <button
                                key={btn}
                                className="numpad-btn numpad-btn-action"
                                onClick={handleBackspace}
                            >
                                <Delete size={32} />
                            </button>
                        );
                    }
                    return (
                        <button
                            key={btn}
                            className="numpad-btn"
                            onClick={() => handleNumber(btn)}
                        >
                            {btn}
                        </button>
                    );
                })}
            </div>

            <button
                className={`btn btn-xl btn-success numpad-submit ${phone.length >= 10 ? '' : 'disabled'}`}
                onClick={handleSubmit}
                disabled={phone.length < 10}
            >
                <Check size={32} />
                <span>Done</span>
            </button>
        </div>
    );
}

export default NumPad;
