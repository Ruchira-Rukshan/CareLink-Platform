package com.carelink.controller;

import com.carelink.dto.ReviewRequest;
import com.carelink.dto.ReviewResponse;
import com.carelink.entity.Review;
import com.carelink.entity.User;
import com.carelink.repository.ReviewRepository;
import com.carelink.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/reviews")
@CrossOrigin(origins = "http://localhost:3000")
public class ReviewController {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;

    public ReviewController(ReviewRepository reviewRepository, UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<ReviewResponse>> getAllReviews() {
        List<ReviewResponse> reviews = reviewRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(ReviewResponse::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(reviews);
    }

    @PostMapping
    public ResponseEntity<?> submitReview(@AuthenticationPrincipal User user,
            @Valid @RequestBody ReviewRequest request) {
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("message", "You must be logged in to leave a review."));
        }

        // Check if user already submitted a review
        if (reviewRepository.findByUserId(user.getId()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message",
                    "You have already submitted a review. You can delete your existing review to post a new one."));
        }

        Review review = new Review();
        review.setUser(user);
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setCreatedAt(LocalDateTime.now());

        reviewRepository.save(review);
        return ResponseEntity.ok(new ReviewResponse(review));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReview(@AuthenticationPrincipal User user, @PathVariable Long id) {
        if (user == null)
            return ResponseEntity.status(401).build();

        Review review = reviewRepository.findById(id).orElse(null);
        if (review == null)
            return ResponseEntity.notFound().build();

        // Only owner or admin can delete
        if (!review.getUser().getId().equals(user.getId()) && !user.getRole().name().equals("ADMIN")) {
            return ResponseEntity.status(403).body(Map.of("message", "You are not authorized to delete this review."));
        }

        reviewRepository.delete(review);
        return ResponseEntity.ok(Map.of("message", "Review deleted successfully."));
    }
}
