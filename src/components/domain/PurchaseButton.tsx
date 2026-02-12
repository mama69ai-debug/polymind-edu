'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import { getStripe } from '@/lib/stripe/client';

interface PurchaseButtonProps {
  courseId: string;
  courseSlug: string;
  isEnrolled: boolean;
}

export function PurchaseButton({ courseId, courseSlug, isEnrolled }: PurchaseButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handlePurchase = async () => {
    try {
      setIsLoading(true);

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          router.push(`/auth/login?redirect=/courses/${courseSlug}`);
          return;
        }
        throw new Error(data.error || 'Failed to create checkout session');
      }

      const stripe = await getStripe();
      if (!stripe) {
        throw new Error('Failed to load Stripe');
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Purchase error:', error);
      alert('購買失敗，請稍後再試');
    } finally {
      setIsLoading(false);
    }
  };

  if (isEnrolled) {
    return (
      <Button
        variant="primary"
        onClick={() => router.push(`/courses/${courseSlug}/learn`)}
      >
        進入學習頁
      </Button>
    );
  }

  return (
    <Button
      variant="primary"
      onClick={handlePurchase}
      loading={isLoading}
      disabled={isLoading}
    >
      購買課程
    </Button>
  );
}
