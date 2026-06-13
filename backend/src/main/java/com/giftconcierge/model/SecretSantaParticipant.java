package com.giftconcierge.model;

import jakarta.persistence.*;

@Entity
@Table(name = "secret_santa_participants")
public class SecretSantaParticipant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "secret_santa_id", nullable = false)
    private SecretSanta secretSanta;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false, length = 100)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to")
    private SecretSantaParticipant assignedTo;

    @Column(name = "wishlist_notes", columnDefinition = "TEXT")
    private String wishlistNotes;

    public SecretSantaParticipant() {
    }

    public SecretSantaParticipant(Long id, SecretSanta secretSanta, User user, String name, SecretSantaParticipant assignedTo, String wishlistNotes) {
        this.id = id;
        this.secretSanta = secretSanta;
        this.user = user;
        this.name = name;
        this.assignedTo = assignedTo;
        this.wishlistNotes = wishlistNotes;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public SecretSanta getSecretSanta() {
        return this.secretSanta;
    }

    public void setSecretSanta(SecretSanta secretSanta) {
        this.secretSanta = secretSanta;
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

    public SecretSantaParticipant getAssignedTo() {
        return this.assignedTo;
    }

    public void setAssignedTo(SecretSantaParticipant assignedTo) {
        this.assignedTo = assignedTo;
    }

    public String getWishlistNotes() {
        return this.wishlistNotes;
    }

    public void setWishlistNotes(String wishlistNotes) {
        this.wishlistNotes = wishlistNotes;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        SecretSantaParticipant that = (SecretSantaParticipant) o;
        return java.util.Objects.equals(id, that.id) &&
                java.util.Objects.equals(name, that.name) &&
                java.util.Objects.equals(wishlistNotes, that.wishlistNotes);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(id, name, wishlistNotes);
    }

    @Override
    public String toString() {
        return "SecretSantaParticipant(id=" + id + ", name=" + name + ", wishlistNotes=" + wishlistNotes + ")";
    }

    public static SecretSantaParticipantBuilder builder() {
        return new SecretSantaParticipantBuilder();
    }

    public static class SecretSantaParticipantBuilder {
        private Long id;
        private SecretSanta secretSanta;
        private User user;
        private String name;
        private SecretSantaParticipant assignedTo;
        private String wishlistNotes;

        SecretSantaParticipantBuilder() {
        }

        public SecretSantaParticipantBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public SecretSantaParticipantBuilder secretSanta(SecretSanta secretSanta) {
            this.secretSanta = secretSanta;
            return this;
        }

        public SecretSantaParticipantBuilder user(User user) {
            this.user = user;
            return this;
        }

        public SecretSantaParticipantBuilder name(String name) {
            this.name = name;
            return this;
        }

        public SecretSantaParticipantBuilder assignedTo(SecretSantaParticipant assignedTo) {
            this.assignedTo = assignedTo;
            return this;
        }

        public SecretSantaParticipantBuilder wishlistNotes(String wishlistNotes) {
            this.wishlistNotes = wishlistNotes;
            return this;
        }

        public SecretSantaParticipant build() {
            return new SecretSantaParticipant(id, secretSanta, user, name, assignedTo, wishlistNotes);
        }
    }
}
