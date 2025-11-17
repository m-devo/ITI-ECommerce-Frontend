import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { CheckoutService } from '../../../core/services/checkout.service';
import { NotificationService } from '../../../core/services/notification.service';
import { CheckoutPreResponse, CheckoutRequest, PaymentMethod } from '../../../core/models/api-models';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: "./checkout.component.html",
  styles: [`
    .container {
      min-height: calc(100vh - 120px);
    }
  `],
  changeDetection: ChangeDetectionStrategy.Default
})
export class CheckoutComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  preData: CheckoutPreResponse | null = null;
  billingForm: FormGroup;
  paymentForm: FormGroup;

  loadingPre = false;
  submitting = false;

  constructor(
    private checkoutService: CheckoutService,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.billingForm = this.fb.group({
      phone: ['', [
        Validators.required,
        Validators.pattern('^\\+?[1-9]\\d{1,14}$')
      ]],
      country: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern('^[a-zA-Z\\s]*$')
      ]],
      state: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern('^[a-zA-Z\\s]*$')
      ]],
      city: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern('^[a-zA-Z\\s]*$')
      ]]
    });

    this.paymentForm = this.fb.group({
      paymentMethod: ['cod' as PaymentMethod, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadPreCheckout();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadPreCheckout(): void {
    this.loadingPre = true;

    this.checkoutService.preCheckout()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          console.log('Pre-checkout response:', res);
          if (res.statusCode === 200 && res.data) {
            console.log('Pre-checkout data:', res.data);
            console.log('Items in cart:', res.data.items);
            this.preData = res.data;
          } else {
            this.notificationService.showError(res.message || 'Failed to load checkout data');
            this.router.navigate(['/cart']);
          }
          this.loadingPre = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.notificationService.showError(err?.error?.message || 'Failed to load checkout data');
          this.loadingPre = false;
          this.router.navigate(['/cart']);
          this.cdr.detectChanges();
        }
      });
  }

  goToPayment(stepper: any): void {
    if (this.billingForm.valid) {
      stepper.next();
    }
  }

  private formatFormValues(): void {
    const billingControls = this.billingForm.controls;

    // Trim
    Object.keys(billingControls).forEach(key => {
      const control = billingControls[key];
      if (typeof control.value === 'string') {
        control.setValue(control.value.trim());
      }
    });
  }

  submitCheckout(): void {
    if (!this.billingForm.valid || !this.paymentForm.valid || this.submitting) {
      return;
    }

    this.formatFormValues();

    this.submitting = true;

    this.checkoutService.preCheckout()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (preCheckoutRes) => {
          if (preCheckoutRes.statusCode === 200 && preCheckoutRes.data) {
            this.preData = preCheckoutRes.data;

            const payload: CheckoutRequest = {
              billingData: this.billingForm.value,
              paymentMethod: this.paymentForm.value.paymentMethod
            };

            this.checkoutService.checkout(payload)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (checkoutRes) => {
                this.submitting = false;

                if (checkoutRes.statusCode === 200 || checkoutRes.statusCode === 201) {
                  if (payload.paymentMethod === 'cod') {
                    this.notificationService.showSuccess(checkoutRes.message || 'Order placed successfully');
                    this.router.navigateByUrl('/order-placed');
                  } else {
                    const { paymentUrl } = checkoutRes.data || {};
                    this.notificationService.showSuccess('Redirecting to payment...');
                    if (paymentUrl) {
                      window.location.href = paymentUrl;
                    }
                  }
                } else {
                  this.notificationService.showError(checkoutRes.message || 'Checkout failed');
                }
                this.cdr.detectChanges();
              },
                error: (err) => {
                  this.submitting = false;
                  const msg = err?.error?.message || err?.message || 'Checkout failed';
                  this.notificationService.showError(msg);
                  this.cdr.detectChanges();
                }
              });
          } else {
            this.submitting = false;
            this.notificationService.showError(preCheckoutRes.message || 'Failed to get latest cart data');
            this.cdr.detectChanges();
          }
        },
        error: (err) => {
          this.submitting = false;
          const msg = err?.error?.message || err?.message || 'Failed to get latest cart data';
          this.notificationService.showError(msg);
          this.cdr.detectChanges();
        }
      });
  }
}
