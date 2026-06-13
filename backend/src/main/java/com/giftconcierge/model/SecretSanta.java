package com.giftconcierge.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "secret_santa")
public class SecretSanta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organizer_id", nullable = false)
    private User organizer;

    @Column(name = "group_name", nullable = false, length = 100)
    private String groupName;

    @Column(name = "budget_limit", precision = 10, scale = 2)
    private BigDecimal budgetLimit;

    @Column(nullable = false, length = 30)
    private String status = "OPEN";

    @Column(name = "join_code", unique = true, length = 20)
    private String joinCode;

    private LocalDate deadline;

    @OneToMany(mappedBy = "secretSanta", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<SecretSantaParticipant> participants = new ArrayList<>();

    public SecretSanta() {
    }

    public SecretSanta(Long id, User organizer, String groupName, BigDecimal budgetLimit, String status, String joinCode, LocalDate deadline, List<SecretSantaParticipant> participants) {
        this.id = id;
        this.organizer = organizer;
        this.groupName = groupName;
        this.budgetLimit = budgetLimit;
        this.status = status;
        this.joinCode = joinCode;
        this.deadline = deadline;
        this.participants = participants;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getOrganizer() {
        return this.organizer;
    }

    public void setOrganizer(User organizer) {
        this.organizer = organizer;
    }

    public String getGroupName() {
        return this.groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public BigDecimal getBudgetLimit() {
        return this.budgetLimit;
    }

    public void setBudgetLimit(BigDecimal budgetLimit) {
        this.budgetLimit = budgetLimit;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getJoinCode() {
        return this.joinCode;
    }

    public void setJoinCode(String joinCode) {
        this.joinCode = joinCode;
    }

    public LocalDate getDeadline() {
        return this.deadline;
    }

    public void setDeadline(LocalDate deadline) {
        this.deadline = deadline;
    }

    public List<SecretSantaParticipant> getParticipants() {
        return this.participants;
    }

    public void setParticipants(List<SecretSantaParticipant> participants) {
        this.participants = participants;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        SecretSanta that = (SecretSanta) o;
        return java.util.Objects.equals(id, that.id) &&
                java.util.Objects.equals(groupName, that.groupName) &&
                java.util.Objects.equals(budgetLimit, that.budgetLimit) &&
                java.util.Objects.equals(status, that.status) &&
                java.util.Objects.equals(joinCode, that.joinCode) &&
                java.util.Objects.equals(deadline, that.deadline);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(id, groupName, budgetLimit, status, joinCode, deadline);
    }

    @Override
    public String toString() {
        return "SecretSanta(id=" + id + ", groupName=" + groupName + ", budgetLimit=" + budgetLimit + ", status=" + status + ", joinCode=" + joinCode + ", deadline=" + deadline + ")";
    }

    public static SecretSantaBuilder builder() {
        return new SecretSantaBuilder();
    }

    public static class SecretSantaBuilder {
        private Long id;
        private User organizer;
        private String groupName;
        private BigDecimal budgetLimit;
        private String status = "OPEN";
        private String joinCode;
        private LocalDate deadline;
        private List<SecretSantaParticipant> participants = new ArrayList<>();

        SecretSantaBuilder() {
        }

        public SecretSantaBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public SecretSantaBuilder organizer(User organizer) {
            this.organizer = organizer;
            return this;
        }

        public SecretSantaBuilder groupName(String groupName) {
            this.groupName = groupName;
            return this;
        }

        public SecretSantaBuilder budgetLimit(BigDecimal budgetLimit) {
            this.budgetLimit = budgetLimit;
            return this;
        }

        public SecretSantaBuilder status(String status) {
            this.status = status;
            return this;
        }

        public SecretSantaBuilder joinCode(String joinCode) {
            this.joinCode = joinCode;
            return this;
        }

        public SecretSantaBuilder deadline(LocalDate deadline) {
            this.deadline = deadline;
            return this;
        }

        public SecretSantaBuilder participants(List<SecretSantaParticipant> participants) {
            this.participants = participants;
            return this;
        }

        public SecretSanta build() {
            return new SecretSanta(id, organizer, groupName, budgetLimit, status, joinCode, deadline, participants);
        }
    }
}
