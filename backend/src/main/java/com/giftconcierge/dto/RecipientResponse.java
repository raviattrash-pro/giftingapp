package com.giftconcierge.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class RecipientResponse {

    private Long id;
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
    private Integer relationshipScore;
    private LocalDateTime createdAt;

    public RecipientResponse() {
    }

    public RecipientResponse(Long id, String name, LocalDate birthday, LocalDate anniversary, String relationship, String gender, Integer age, String interests, String favoriteBrands, String hobbies, String clothingSize, String preferredColors, String allergies, String notes, String avatarUrl, Integer relationshipScore, LocalDateTime createdAt) {
        this.id = id;
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
        this.relationshipScore = relationshipScore;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Integer getRelationshipScore() {
        return this.relationshipScore;
    }

    public void setRelationshipScore(Integer relationshipScore) {
        this.relationshipScore = relationshipScore;
    }

    public LocalDateTime getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        RecipientResponse that = (RecipientResponse) o;
        return java.util.Objects.equals(id, that.id) &&
                java.util.Objects.equals(name, that.name) &&
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
                java.util.Objects.equals(avatarUrl, that.avatarUrl) &&
                java.util.Objects.equals(relationshipScore, that.relationshipScore) &&
                java.util.Objects.equals(createdAt, that.createdAt);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(id, name, birthday, anniversary, relationship, gender, age, interests, favoriteBrands, hobbies, clothingSize, preferredColors, allergies, notes, avatarUrl, relationshipScore, createdAt);
    }

    @Override
    public String toString() {
        return "RecipientResponse(id=" + id + ", name=" + name + ", birthday=" + birthday + ", anniversary=" + anniversary + ", relationship=" + relationship + ", gender=" + gender + ", age=" + age + ", interests=" + interests + ", favoriteBrands=" + favoriteBrands + ", hobbies=" + hobbies + ", clothingSize=" + clothingSize + ", preferredColors=" + preferredColors + ", allergies=" + allergies + ", notes=" + notes + ", avatarUrl=" + avatarUrl + ", relationshipScore=" + relationshipScore + ", createdAt=" + createdAt + ")";
    }

    public static RecipientResponseBuilder builder() {
        return new RecipientResponseBuilder();
    }

    public static class RecipientResponseBuilder {
        private Long id;
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
        private Integer relationshipScore;
        private LocalDateTime createdAt;

        RecipientResponseBuilder() {
        }

        public RecipientResponseBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public RecipientResponseBuilder name(String name) {
            this.name = name;
            return this;
        }

        public RecipientResponseBuilder birthday(LocalDate birthday) {
            this.birthday = birthday;
            return this;
        }

        public RecipientResponseBuilder anniversary(LocalDate anniversary) {
            this.anniversary = anniversary;
            return this;
        }

        public RecipientResponseBuilder relationship(String relationship) {
            this.relationship = relationship;
            return this;
        }

        public RecipientResponseBuilder gender(String gender) {
            this.gender = gender;
            return this;
        }

        public RecipientResponseBuilder age(Integer age) {
            this.age = age;
            return this;
        }

        public RecipientResponseBuilder interests(String interests) {
            this.interests = interests;
            return this;
        }

        public RecipientResponseBuilder favoriteBrands(String favoriteBrands) {
            this.favoriteBrands = favoriteBrands;
            return this;
        }

        public RecipientResponseBuilder hobbies(String hobbies) {
            this.hobbies = hobbies;
            return this;
        }

        public RecipientResponseBuilder clothingSize(String clothingSize) {
            this.clothingSize = clothingSize;
            return this;
        }

        public RecipientResponseBuilder preferredColors(String preferredColors) {
            this.preferredColors = preferredColors;
            return this;
        }

        public RecipientResponseBuilder allergies(String allergies) {
            this.allergies = allergies;
            return this;
        }

        public RecipientResponseBuilder notes(String notes) {
            this.notes = notes;
            return this;
        }

        public RecipientResponseBuilder avatarUrl(String avatarUrl) {
            this.avatarUrl = avatarUrl;
            return this;
        }

        public RecipientResponseBuilder relationshipScore(Integer relationshipScore) {
            this.relationshipScore = relationshipScore;
            return this;
        }

        public RecipientResponseBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public RecipientResponse build() {
            return new RecipientResponse(id, name, birthday, anniversary, relationship, gender, age, interests, favoriteBrands, hobbies, clothingSize, preferredColors, allergies, notes, avatarUrl, relationshipScore, createdAt);
        }
    }
}
