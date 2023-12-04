import React from "react";
import { useState, useEffect } from "react";

function PromptReceipts() {

  const fields = [
    { id: "dateTime", label: "Date/Time", type: "date" },
    { id: "businessName", label: "Business Name", type: "text" },
    { id: "address", label: "Address", type: "text" },
    { id: "contract", label: "Contract", type: "text" },
    { id: "itemsPurchased", label: "Items Purchased", type: "text" },
    { id: "price", label: "Price", type: "price" },
    { id: "tax", label: "Tax", type: "number", currency: true },
    { id: "price", label: "Price", type: "price" },
    { id: "paymentMethod", label: "Payment Method", type: "text" },
    { id: "transactionNumber", label: "Transaction Number", type: "text" },
    { id: "cashierName", label: "Cashier/Server Name", type: "text" },
    { id: "discountCoupons", label: "Discount Coupons", type: "text" },
    { id: "tips", label: "Tips", type: "number" },
    { id: "notes", label: "Notes", type: "textarea" },
  ];

  const initialFormData = fields.reduce((acc, field) => {
    acc[field.id] = "";
    return acc;
  }, {});

  const formatPrice = (value) => {
    return `$${parseFloat(value).toFixed(2)}`;
  };

  const formatDate = (value) => {
    const date = new Date(value);
    return `${(date.getMonth() + 1).toString().padStart(2, "0")}/${date
      .getDate()
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  };

  const [formData, setFormData] = useState(initialFormData);
  const handleFieldChange = (fieldId, value) => {
    if (fields.find((field) => field.id === fieldId).currency) {
      value = value.replace(/^\$/, ""); // Remove leading dollar sign
    }
    setFormData({ ...formData, [fieldId]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formData); // Here you can handle the form submission
  };

  return (
    <>
      {/* this is navigation */}
      <div className="border rounded-md m-10">
        {/* table header */}
        <div className="text-xl w-full flex">
          <div className="">Receipts</div>
          <div className="flex mr-0 ml-auto">
            <div className="mr-2">sync</div>
            <div>options</div>
          </div>
          <div className="border-b"></div>
        </div>
        {/* table body */}
        <div className="flex">
          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map((field) => (
              <div key={field.id} className="flex flex-col">
                <label
                  htmlFor={field.id}
                  className="mb-2 text-sm font-semibold text-gray-700"
                >
                  {field.label}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    id={field.id}
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                    value={formData[field.id]}
                    onChange={(e) =>
                      handleFieldChange(field.id, e.target.value)
                    }
                  />
                ) : field.type === "price" ? (
                  <input
                    type="text"
                    id={field.id}
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                    value={formatPrice(formData[field.id])}
                    onChange={(e) =>
                      handleFieldChange(
                        field.id,
                        e.target.value.replace(/^\$/, "")
                      )
                    }
                  />
                ) : field.type === "date" ? (
                  <input
                    type="date"
                    id={field.id}
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                    value={formData[field.id]}
                    onChange={(e) =>
                      handleFieldChange(field.id, e.target.value)
                    }
                  />
                ) : (
                  <input
                    type="text"
                    id={field.id}
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                    value={formData[field.id]}
                    onChange={(e) =>
                      handleFieldChange(field.id, e.target.value)
                    }
                  />
                )}
              </div>
            ))}
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Submit
            </button>
          </form>
          {/* preview */}
          <div>
            <div className="w-1/2">
              <div>here is preview</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PromptReceipts;
