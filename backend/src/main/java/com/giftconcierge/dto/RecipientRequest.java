package com.giftconcierge.dto;

import java.time.LocalDate;

public class RecipientRequest {

    private String name;
    private LocalDate birthday;
    private LocalDate anniversary;
    private String relationship;
    private String gender;
    private Integer age;
    private String interests;
    private String favoriteBrands;
    private String hobbies;
    private String clothingSize;
    private String preferredColors;
    private String allergies;
    private String notes;
    private String avatarUrl;

    public RecipientRequest() {
    }

    public RecipientRequest(String name, LocalDate birthday, LocalDate anniversary, String relationship, String gender, Integer age, String interests, String favoriteBrands, String hobbies, String clothingSize, String preferredColors, String allergies, String notes, String avatarUrl) {
        this.name = name;
        this.birthday = birthday;
        this.anniversary = anniversary;
        this.relationship = relationship;
        this.gender = gender;
        this.age = age;
        this.interests = interests;
        this.favoriteBrands = favoriteBrands;
        this.hobbies = hobbies;
        this.clothingSize = clothingSize;
        this.preferredColors = preferredColors;
        this.allergies = allergies;
        this.notes = notes;
        this.avatarUrl = avatarUrl;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDate getBirthday() {
        return this.birthday;
    }

    public void setBirthday(LocalDate birthday) {
        this.birthday = birthday;
    }

    public LocalDate getAnniversary() {
        return this.anniversary;
    }

    public void setAnniversary(LocalDate anniversary) {
        this.anniversary = anniversary;
    }

    public String getRelationship() {
        return this.relationship;
    }

    public void setRelationship(String relationship) {
        this.relationship = relationship;
    }

    public String getGender() {
        return this.gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public Integer getAge() {
        return this.age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getInterests() {
        return this.interests;
    }

    public void setInterests(String interests) {
        this.interests = interests;
    }

    public String getFavoriteBrands() {
        return this.favoriteBrands;
    }

    public void setFavoriteBrands(String favoriteBrands) {
        this.favoriteBrands = favoriteBrands;
    }

    public String getHobbies() {
        return this.hobbies;
    }

    public void setHobbies(String hobbies) {
        this.hobbies = hobbies;
    }

    public String getClothingSize() {
        return this.clothingSize;
    }

    public void setClothingSize(String clothingSize) {
        this.clothingSize = clothingSize;
    }

    public String getPreferredColors() {
        return this.preferredColors;
    }

    public void setPreferredColors(String preferredColors) {
        this.preferredColors = preferredColors;
    }

    public String getAllergies() {
        return this.allergies;
    }

    public void setAllergies(String allergies) {
        this.allergies = allergies;
    }

    public String getNotes() {
        return this.notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getAvatarUrl() {
        return this.avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        RecipientRequest that = (RecipientRequest) o;
        return java.util.Objects.equals(name, that.name) &&
                java.util.Objects.equals(birthday, that.birthday) &&
                java.util.Objects.equals(anniversary, that.anniversary) &&
                java.util.Objects.equals(relationship, that.relationship) &&
                java.util.Objects.equals(gender, that.gender) &&
                java.util.Objects.equals(age, that.age) &&
                java.util.Objects.equals(interests, that.interests) &&
                java.util.Objects.equals(favoriteBrands, that.favoriteBrands) &&
                java.util.Objects.equals(hobbies, that.hobbies) &&
                java.util.Objects.equals(clothingSize, that.clothingSize) &&
                java.util.Objects.equals(preferredColors, that.preferredColors) &&
                java.util.Objects.equals(allergies, that.allergies) &&
                java.util.Objects.equals(notes, that.notes) &&
                java.util.Objects.equals(avatarUrl, that.avatarUrl);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(name, birthday, anniversary, relationship, gender, age, interests, favoriteBrands, hobbies, clothingSize, preferredColors, allergies, notes, avatarUrl);
    }

    @Override
    public String toString() {
        return "RecipientRequest(name=" + name + ", birthday=" + birthday + ", anniversary=" + anniversary + ", relationship=" + relationship + ", gender=" + gender + ", age=" + age + ", interests=" + interests + ", favoriteBrands=" + favoriteBrands + ", hobbies=" + hobbies + ", clothingSize=" + clothingSize + ", preferredColors=" + preferredColors + ", allergies=" + allergies + ", notes=" + notes + ", avatarUrl=" + avatarUrl + ")";
    }

    public static RecipientRequestBuilder builder() {
        return new RecipientRequestBuilder();
    }

    public static class RecipientRequestBuilder {
        private String name;
        private LocalDate birthday;
        private LocalDate anniversary;
        private String relationship;
        private String gender;
        private Integer age;
        private String interests;
        private String favoriteBrands;
        private String hobbies;
        private String clothingSize;
        private String preferredColors;
        private String allergies;
        private String notes;
        private String avatarUrl;

        RecipientRequestBuilder() {
        }

        public RecipientRequestBuilder name(String name) {
            this.name = name;
            return this;
        }

        public RecipientRequestBuilder birthday(LocalDate birthday) {
            this.birthday = birthday;
            return this;
        }

        public RecipientRequestBuilder anniversary(LocalDate anniversary) {
            this.anniversary = anniversary;
            return this;
        }

        public RecipientRequestBuilder relationship(String relationship) {
            this.relationship = relationship;
            return this;
        }

        public RecipientRequestBuilder gender(String gender) {
            this.gender = gender;
            return this;
        }

        public RecipientRequestBuilder age(Integer age) {
            this.age = age;
            return this;
        }

        public RecipientRequestBuilder interests(String interests) {
            this.interests = interests;
            return this;
        }

        public RecipientRequestBuilder favoriteBrands(String favoriteBrands) {
            this.favoriteBrands = favoriteBrands;
            return this;
        }

        public RecipientRequestBuilder hobbies(String hobbies) {
            this.hobbies = hobbies;
            return this;
        }

        public RecipientRequestBuilder clothingSize(String clothingSize) {
            this.clothingSize = clothingSize;
            return this;
        }

        public RecipientRequestBuilder preferredColors(String preferredColors) {
            this.preferredColors = preferredColors;
            return this;
        }

        public RecipientRequestBuilder allergies(String allergies) {
            this.allergies = allergies;
            return this;
        }

        public RecipientRequestBuilder notes(String notes) {
            this.notes = notes;
            return this;
        }

        public RecipientRequestBuilder avatarUrl(String avatarUrl) {
            this.avatarUrl = avatarUrl;
            return this;
        }

        public RecipientRequest build() {
            return new RecipientRequest(name, birthday, anniversary, relationship, gender, age, interests, favoriteBrands, hobbies, clothingSize, preferredColors, allergies, notes, avatarUrl);
        }
    }
}
