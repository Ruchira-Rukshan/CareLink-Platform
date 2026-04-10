package com.carelink.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "supplier_products", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "supplier_id", "medicine_id" }) // A supplier can only have one listing per
                                                                          // medicine
})
public class SupplierProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;

    @ManyToOne(optional = false)
    @JoinColumn(name = "medicine_id")
    private Medicine medicine;

    @Column(nullable = false)
    private double bulkPrice;

    @Column(nullable = false)
    private int minOrderQuantity;

    private boolean active = true;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Supplier getSupplier() {
        return supplier;
    }

    public void setSupplier(Supplier supplier) {
        this.supplier = supplier;
    }

    public Medicine getMedicine() {
        return medicine;
    }

    public void setMedicine(Medicine medicine) {
        this.medicine = medicine;
    }

    public double getBulkPrice() {
        return bulkPrice;
    }

    public void setBulkPrice(double bulkPrice) {
        this.bulkPrice = bulkPrice;
    }

    public int getMinOrderQuantity() {
        return minOrderQuantity;
    }

    public void setMinOrderQuantity(int minOrderQuantity) {
        this.minOrderQuantity = minOrderQuantity;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
