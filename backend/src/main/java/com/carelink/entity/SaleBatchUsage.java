package com.carelink.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "sale_batch_usage")
public class SaleBatchUsage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "sale_item_id")
    @JsonBackReference("item-usages")
    private SaleItem saleItem;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "batch_id")
    private MedicineBatch batch;

    @Column(nullable = false)
    private int qtyUsed;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public SaleItem getSaleItem() {
        return saleItem;
    }

    public void setSaleItem(SaleItem saleItem) {
        this.saleItem = saleItem;
    }

    public MedicineBatch getBatch() {
        return batch;
    }

    public void setBatch(MedicineBatch batch) {
        this.batch = batch;
    }

    public int getQtyUsed() {
        return qtyUsed;
    }

    public void setQtyUsed(int qtyUsed) {
        this.qtyUsed = qtyUsed;
    }
}
