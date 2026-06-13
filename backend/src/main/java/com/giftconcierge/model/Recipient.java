package com.giftconcierge.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "recipients")
public class Recipient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 100)
    private String name;

    private LocalDate birthday;

    private LocalDate anniversary;

    @Column(length = 50)
    private String relationship;

    @Column(length = 20)
    private String gender;

    private Integer age;

    @Column(columnDefinition = "TEXT")
    private String interests;

    @Column(name = "favorite_brands", columnDefinition = "TEXT")
    private String favoriteBrands;

    @Column(columnDefinition = "TEXT")
    private String hobbies;

    @Column(name = "clothing_size", length = 20)
    private String clothingSize;

    @Column(name = "preferred_colors", columnDefinition = "TEXT")
    private String preferredColors;

    @Column(columnDefinition = "TEXT")
    private String allergies;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "avatar_url", columnDefinition = "TEXT")
    private String avatarUrl;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public Recipient() {
    }

    public Recipient(Long id, User user, String name, LocalDate birthday, LocalDate anniversary, String relationship, String gender, Integer age, String interests, String favoriteBrands, String hobbies, String clothingSize, String preferredColors, String allergies, String notes, String avatarUrl, LocalDateTime createdAt) {
        this.id = id;
        this.user = user;
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
        this.createdAt = createdAt;
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
        Recipient recipient = (Recipient) o;
        return java.util.Objects.equals(id, recipient.id) &&
                java.util.Objects.equals(name, recipient.name) &&
                java.util.Objects.equals(birthday, recipient.birthday) &&
                java.util.Objects.equals(anniversary, recipient.anniversary) &&
                java.util.Objects.equals(relationship, recipient.relationship) &&
                java.util.Objects.equals(gender, recipient.gender) &&
                java.util.Objects.equals(age, recipient.age) &&
                java.util.Objects.equals(interests, recipient.interests) &&
                java.util.Objects.equals(favoriteBrands, recipient.favoriteBrands) &&
                java.util.Objects.equals(hobbies, recipient.hobbies) &&
                java.util.Objects.equals(clothingSize, recipient.clothingSize) &&
                java.util.Objects.equals(preferredColors, recipient.preferredColors) &&
                java.util.Objects.equals(allergies, recipient.allergies) &&
                java.util.Objects.equals(notes, recipient.notes) &&
                java.util.Objects.equals(avatarUrl, recipient.avatarUrl) &&
                java.util.Objects.equals(createdAt, recipient.createdAt);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(id, name, birthday, anniversary, relationship, gender, age, interests, favoriteBrands, hobbies, clothingSize, preferredColors, allergies, notes, avatarUrl, createdAt);
    }

    @Override
    public String toString() {
        return "Recipient(id=" + id + ", name=" + name + ", birthday=" + birthday + ", anniversary=" + anniversary + ", relationship=" + relationship + ", gender=" + gender + ", age=" + age + ", interests=" + interests + ", favoriteBrands=" + favoriteBrands + ", hobbies=" + hobbies + ", clothingSize=" + clothingSize + ", preferredColors=" + preferredColors + ", allergies=" + allergies + ", notes=" + notes + ", avatarUrl=" + avatarUrl + ", createdAt=" + createdAt + ")";
    }

    public static RecipientBuilder builder() {
        return new RecipientBuilder();
    }

    public static class RecipientBuilder {
        private Long id;
        private User user;
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
        private LocalDateTime createdAt;

        RecipientBuilder() {
        }

        public RecipientBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public RecipientBuilder user(User user) {
            this.user = user;
            return this;
        }

        public RecipientBuilder name(String name) {
            this.name = name;
            return this;
        }

        public RecipientBuilder birthday(LocalDate birthday) {
            this.birthday = birthday;
            return this;
        }

        public RecipientBuilder anniversary(LocalDate anniversary) {
            this.anniversary = anniversary;
            return this;
        }

        public RecipientBuilder relationship(String relationship) {
            this.relationship = relationship;
            return this;
        }

        public RecipientBuilder gender(String gender) {
            this.gender = gender;
            return this;
        }

        public RecipientBuilder age(Integer age) {
            this.age = age;
            return this;
        }

        public RecipientBuilder interests(String interests) {
            this.interests = interests;
            return this;
        }

        public RecipientBuilder favoriteBrands(String favoriteBrands) {
            this.favoriteBrands = favoriteBrands;
            return this;
        }

        public RecipientBuilder hobbies(String hobbies) {
            this.hobbies = hobbies;
            return this;
        }

        public RecipientBuilder clothingSize(String clothingSize) {
            this.clothingSize = clothingSize;
            return this;
        }

        public RecipientBuilder preferredColors(String preferredColors) {
            this.preferredColors = preferredColors;
            return this;
        }

        public RecipientBuilder allergies(String allergies) {
            this.allergies = allergies;
            return this;
        }

        public RecipientBuilder notes(String notes) {
            this.notes = notes;
            return this;
        }

        public RecipientBuilder avatarUrl(String avatarUrl) {
            this.avatarUrl = avatarUrl;
            return this;
        }

        public RecipientBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public Recipient build() {
            return new Recipient(id, user, name, birthday, anniversary, relationship, gender, age, interests, favoriteBrands, hobbies, clothingSize, preferredColors, allergies, notes, avatarUrl, createdAt);
        }
    }
}
