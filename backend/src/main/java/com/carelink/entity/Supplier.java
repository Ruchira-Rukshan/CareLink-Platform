package com.carelink.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "suppliers", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "companyRegId" })
})
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false, unique = true)
    private String companyRegId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private boolean active = true;

    private String phone;
    private String email;

    // getters/setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCompanyRegId() {
        return companyRegId;
    }

    public void setCompanyRegId(String companyRegId) {
        this.companyRegId = companyRegId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
