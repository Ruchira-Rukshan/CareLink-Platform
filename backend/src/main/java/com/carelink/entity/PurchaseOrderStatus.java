package com.carelink.entity;

public enum PurchaseOrderStatus {
    CREATED, // Pharmacy created the order
    PROCESSING, // Supplier acknowledged and is preparing
    SHIPPED, // Supplier has dispatched the order
    RECEIVED, // Pharmacy confirmed delivery (triggers stock update)
    INVOICED, // Supplier has generated an invoice and finalized order
    CANCELLED // Order was cancelled by either party
}
