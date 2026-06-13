package com.giftconcierge.model;

import jakarta.persistence.*;

@Entity
@Table(name = "payment_settings")
public class PaymentSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "upi_id", length = 100)
    private String upiId;

    @Column(name = "qr_code_url", columnDefinition = "LONGTEXT")
    private String qrCodeUrl;

    public PaymentSettings() {
    }

    public PaymentSettings(Long id, String upiId, String qrCodeUrl) {
        this.id = id;
        this.upiId = upiId;
        this.qrCodeUrl = qrCodeUrl;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUpiId() {
        return this.upiId;
    }

    public void setUpiId(String upiId) {
        this.upiId = upiId;
    }

    public String getQrCodeUrl() {
        return this.qrCodeUrl;
    }

    public void setQrCodeUrl(String qrCodeUrl) {
        this.qrCodeUrl = qrCodeUrl;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PaymentSettings that = (PaymentSettings) o;
        return java.util.Objects.equals(id, that.id) &&
                java.util.Objects.equals(upiId, that.upiId) &&
                java.util.Objects.equals(qrCodeUrl, that.qrCodeUrl);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(id, upiId, qrCodeUrl);
    }

    @Override
    public String toString() {
        return "PaymentSettings(id=" + id + ", upiId=" + upiId + ", qrCodeUrl=" + qrCodeUrl + ")";
    }

    public static PaymentSettingsBuilder builder() {
        return new PaymentSettingsBuilder();
    }

    public static class PaymentSettingsBuilder {
        private Long id;
        private String upiId;
        private String qrCodeUrl;

        PaymentSettingsBuilder() {
        }

        public PaymentSettingsBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public PaymentSettingsBuilder upiId(String upiId) {
            this.upiId = upiId;
            return this;
        }

        public PaymentSettingsBuilder qrCodeUrl(String qrCodeUrl) {
            this.qrCodeUrl = qrCodeUrl;
            return this;
        }

        public PaymentSettings build() {
            return new PaymentSettings(id, upiId, qrCodeUrl);
        }
    }
}
