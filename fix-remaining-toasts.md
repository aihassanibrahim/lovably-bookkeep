# Fix Remaining Toast Issues

## Problem
React error: "Objects are not valid as a React child (found: object with keys {title, description})"

## Root Cause
The application uses `sonner` toast library, but some components are using the old toast format with `title` and `description` as object properties instead of using `toast.success()` and `toast.error()` methods.

## Files That Need Fixing

### 1. src/components/FeatureRestriction.tsx
```typescript
// OLD (causes error):
toast({
  title: 'Funktion begränsad',
  description: 'Uppgradera till Pro för att använda denna funktion.',
  variant: 'destructive',
});

// NEW (fixed):
toast.error('Funktion begränsad', {
  description: 'Uppgradera till Pro för att använda denna funktion.'
});
```

### 2. src/components/PricingSection.tsx
```typescript
// OLD:
toast({
  title: 'Omdirigerar till betalning',
  description: 'Du kommer att skickas till Stripe för att slutföra din prenumeration.',
});

// NEW:
toast.success('Omdirigerar till betalning', {
  description: 'Du kommer att skickas till Stripe för att slutföra din prenumeration.'
});
```

### 3. src/components/PlanLimitBanner.tsx
```typescript
// OLD:
toast({
  title: 'Gräns nådd',
  description: 'Du har nått gränsen för din nuvarande plan.',
  variant: 'destructive',
});

// NEW:
toast.error('Gräns nådd', {
  description: 'Du har nått gränsen för din nuvarande plan.'
});
```

### 4. src/components/FeedbackForm.tsx
```typescript
// OLD:
toast({
  title: 'Feedback skickad!',
  description: 'Tack för din feedback.',
});

// NEW:
toast.success('Feedback skickad!', {
  description: 'Tack för din feedback.'
});
```

## Pattern to Follow
- **Success messages**: `toast.success("Title", { description: "Description" })`
- **Error messages**: `toast.error("Title", { description: "Description" })`
- **Info messages**: `toast("Message")` or `toast.info("Message", { description: "Description" })`

## Status
✅ **Fixed**: LandingPage.tsx, Dashboard.tsx, GuestLoginButton.tsx
⏳ **Pending**: FeatureRestriction.tsx, PricingSection.tsx, PlanLimitBanner.tsx, FeedbackForm.tsx

## Test
After fixing, test the "Prova free" button to ensure no more React errors occur. 