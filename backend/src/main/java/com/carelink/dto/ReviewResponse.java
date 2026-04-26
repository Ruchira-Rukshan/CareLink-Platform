package com.carelink.dto;

import com.carelink.entity.Review;
import java.time.LocalDateTime;

public class ReviewResponse {
    private Long id;
    private Long reviewerId;
    private String reviewerName;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;
    private String role;

    public ReviewResponse(Review review) {
        this.id = review.getId();
        this.reviewerId = review.getUser().getId();
        this.reviewerName = review.getUser().getFirstName() + " " + review.getUser().getLastName();
        this.rating = review.getRating();
        this.comment = review.getComment();
        this.createdAt = review.getCreatedAt();
        this.role = review.getUser().getRole().name();
    }

    public Long getId() {
        return id;
    }

    public Long getReviewerId() {
        return reviewerId;
    }

    public String getReviewerName() {
        return reviewerName;
    }

    public Integer getRating() {
        return rating;
    }

    public String getComment() {
        return comment;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public String getRole() {
        return role;
    }
}
