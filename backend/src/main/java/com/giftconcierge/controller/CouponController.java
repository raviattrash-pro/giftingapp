package com.giftconcierge.controller;

import com.giftconcierge.model.Coupon;
import com.giftconcierge.repository.CouponRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/coupons")
public class CouponController {

    private final CouponRepository couponRepository;

    public CouponController(CouponRepository couponRepository) {
        this.couponRepository = couponRepository;
    }

    @GetMapping
    public ResponseEntity<List<Coupon>> getAllCoupons() {
        return ResponseEntity.ok(couponRepository.findAll());
    }

    @GetMapping("/validate/{code}")
    public ResponseEntity<Coupon> validateCoupon(@PathVariable String code) {
        return couponRepository.findByCodeAndIsEnabledTrue(code)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Coupon> createCoupon(@RequestBody Coupon coupon) {
        return ResponseEntity.ok(couponRepository.save(coupon));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Coupon> updateCoupon(@PathVariable Long id, @RequestBody Coupon couponDetails) {
        return couponRepository.findById(id).map(coupon -> {
            coupon.setCode(couponDetails.getCode());
            coupon.setDiscountAmount(couponDetails.getDiscountAmount());
            coupon.setIsEnabled(couponDetails.getIsEnabled());
            return ResponseEntity.ok(couponRepository.save(coupon));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCoupon(@PathVariable Long id) {
        if (couponRepository.existsById(id)) {
            couponRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
