package com.carelink.dto;

import com.carelink.entity.Medicine;
import java.util.List;

public class InventoryAlertsResponse {
    private List<Medicine> expired;
    private List<Medicine> expiringSoon;
    private List<Medicine> lowStock;

    public List<Medicine> getExpired() {
        return expired;
    }

    public void setExpired(List<Medicine> expired) {
        this.expired = expired;
    }

    public List<Medicine> getExpiringSoon() {
        return expiringSoon;
    }

    public void setExpiringSoon(List<Medicine> expiringSoon) {
        this.expiringSoon = expiringSoon;
    }

    public List<Medicine> getLowStock() {
        return lowStock;
    }

    public void setLowStock(List<Medicine> lowStock) {
        this.lowStock = lowStock;
    }
}
