package com.giftconcierge.dto;

public class PaymentSettingsDto {
    private String upiId;
    private String qrCodeUrl;

    public PaymentSettingsDto() {
    }

    public PaymentSettingsDto(String upiId, String qrCodeUrl) {
        this.upiId = upiId;
        this.qrCodeUrl = qrCodeUrl;
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
        PaymentSettingsDto that = (PaymentSettingsDto) o;
        return java.util.Objects.equals(upiId, that.upiId) &&
                java.util.Objects.equals(qrCodeUrl, that.qrCodeUrl);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(upiId, qrCodeUrl);
    }

    @Override
    public String toString() {
        return "PaymentSettingsDto(upiId=" + upiId + ", qrCodeUrl=" + qrCodeUrl + ")";
    }

    public static PaymentSettingsDtoBuilder builder() {
        return new PaymentSettingsDtoBuilder();
    }

    public static class PaymentSettingsDtoBuilder {
        private String upiId;
        private String qrCodeUrl;

        PaymentSettingsDtoBuilder() {
        }

        public PaymentSettingsDtoBuilder upiId(String upiId) {
            this.upiId = upiId;
            return this;
        }

        public PaymentSettingsDtoBuilder qrCodeUrl(String qrCodeUrl) {
            this.qrCodeUrl = qrCodeUrl;
            return this;
        }

        public PaymentSettingsDto build() {
            return new PaymentSettingsDto(upiId, qrCodeUrl);
        }
    }
}
