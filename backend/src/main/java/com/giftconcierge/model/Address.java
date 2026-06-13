package com.giftconcierge.model;

import jakarta.persistence.*;

@Entity
@Table(name = "addresses")
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_id")
    private Recipient recipient;

    @Column(length = 50)
    private String label;

    @Column(name = "address_line1", nullable = false)
    private String addressLine1;

    @Column(name = "address_line2")
    private String addressLine2;

    @Column(nullable = false, length = 100)
    private String city;

    @Column(length = 100)
    private String state;

    @Column(name = "postal_code", length = 20)
    private String postalCode;

    @Column(nullable = false, length = 50)
    private String country;

    @Column(name = "is_default")
    private Boolean isDefault = false;

    public Address() {
    }

    public Address(Long id, User user, Recipient recipient, String label, String addressLine1, String addressLine2, String city, String state, String postalCode, String country, Boolean isDefault) {
        this.id = id;
        this.user = user;
        this.recipient = recipient;
        this.label = label;
        this.addressLine1 = addressLine1;
        this.addressLine2 = addressLine2;
        this.city = city;
        this.state = state;
        this.postalCode = postalCode;
        this.country = country;
        this.isDefault = isDefault;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Recipient getRecipient() {
        return this.recipient;
    }

    public void setRecipient(Recipient recipient) {
        this.recipient = recipient;
    }

    public String getLabel() {
        return this.label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getAddressLine1() {
        return this.addressLine1;
    }

    public void setAddressLine1(String addressLine1) {
        this.addressLine1 = addressLine1;
    }

    public String getAddressLine2() {
        return this.addressLine2;
    }

    public void setAddressLine2(String addressLine2) {
        this.addressLine2 = addressLine2;
    }

    public String getCity() {
        return this.city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return this.state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getPostalCode() {
        return this.postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public String getCountry() {
        return this.country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public Boolean getIsDefault() {
        return this.isDefault;
    }

    public void setIsDefault(Boolean isDefault) {
        this.isDefault = isDefault;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Address address = (Address) o;
        return java.util.Objects.equals(id, address.id) &&
                java.util.Objects.equals(label, address.label) &&
                java.util.Objects.equals(addressLine1, address.addressLine1) &&
                java.util.Objects.equals(addressLine2, address.addressLine2) &&
                java.util.Objects.equals(city, address.city) &&
                java.util.Objects.equals(state, address.state) &&
                java.util.Objects.equals(postalCode, address.postalCode) &&
                java.util.Objects.equals(country, address.country) &&
                java.util.Objects.equals(isDefault, address.isDefault);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(id, label, addressLine1, addressLine2, city, state, postalCode, country, isDefault);
    }

    @Override
    public String toString() {
        return "Address(id=" + id + ", label=" + label + ", addressLine1=" + addressLine1 + ", addressLine2=" + addressLine2 + ", city=" + city + ", state=" + state + ", postalCode=" + postalCode + ", country=" + country + ", isDefault=" + isDefault + ")";
    }

    public static AddressBuilder builder() {
        return new AddressBuilder();
    }

    public static class AddressBuilder {
        private Long id;
        private User user;
        private Recipient recipient;
        private String label;
        private String addressLine1;
        private String addressLine2;
        private String city;
        private String state;
        private String postalCode;
        private String country;
        private Boolean isDefault = false; // builder default

        AddressBuilder() {
        }

        public AddressBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public AddressBuilder user(User user) {
            this.user = user;
            return this;
        }

        public AddressBuilder recipient(Recipient recipient) {
            this.recipient = recipient;
            return this;
        }

        public AddressBuilder label(String label) {
            this.label = label;
            return this;
        }

        public AddressBuilder addressLine1(String addressLine1) {
            this.addressLine1 = addressLine1;
            return this;
        }

        public AddressBuilder addressLine2(String addressLine2) {
            this.addressLine2 = addressLine2;
            return this;
        }

        public AddressBuilder city(String city) {
            this.city = city;
            return this;
        }

        public AddressBuilder state(String state) {
            this.state = state;
            return this;
        }

        public AddressBuilder postalCode(String postalCode) {
            this.postalCode = postalCode;
            return this;
        }

        public AddressBuilder country(String country) {
            this.country = country;
            return this;
        }

        public AddressBuilder isDefault(Boolean isDefault) {
            this.isDefault = isDefault;
            return this;
        }

        public Address build() {
            return new Address(id, user, recipient, label, addressLine1, addressLine2, city, state, postalCode, country, isDefault);
        }
    }
}
