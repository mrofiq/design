# Component Quick Reference - JanjiTemu System

## Installation Commands

### Initial Setup
```bash
npx shadcn-ui@latest init
```

### Critical Path (MVP Blockers)
```bash
# Install all critical components at once
npx shadcn-ui@latest add form input select radio-group button calendar popover card badge dialog toast table navigation-menu

# Install form validation dependencies
npm install react-hook-form @hookform/resolvers zod date-fns
```

### High Priority (MVP Recommended)
```bash
npx shadcn-ui@latest add textarea checkbox label tabs sheet alert-dialog alert dropdown-menu avatar progress separator
```

### Medium Priority (Post-MVP Polish)
```bash
npx shadcn-ui@latest add tooltip skeleton scroll-area toggle accordion
```

---

## Component Usage by Interface

### Patient Booking Interface
**Must Have:**
- Form, Input, Select, RadioGroup, Button
- Calendar, Popover
- Card, Badge, Dialog, Toast, Progress

**Nice to Have:**
- Textarea (for notes), Checkbox (consent), Alert (warnings), ScrollArea (time slots)

### Admin Dashboard
**Must Have:**
- Table, NavigationMenu, Sheet, Tabs
- Form, Input, Button, Select
- Dialog, AlertDialog, DropdownMenu
- Card, Badge, Avatar

**Nice to Have:**
- Tooltip, Separator, Toggle, Skeleton

### Owner Dashboard
**All Admin Components PLUS:**
- Accordion (for detailed reports)
- Enhanced Tables (with export capabilities)
- Additional Card variants (for metrics)

---

## Component Pairing Patterns

### Form Input Pattern
```tsx
<Form {...form}>
  <FormField
    control={form.control}
    name="fieldName"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Field Label</FormLabel>
        <FormControl>
          <Input {...field} />
        </FormControl>
        <FormDescription>Optional help text</FormDescription>
        <FormMessage />
      </FormItem>
    )}
  />
</Form>
```

### Date Picker Pattern
```tsx
<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">
      {date ? format(date, "PPP") : "Pick a date"}
    </Button>
  </PopoverTrigger>
  <PopoverContent>
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      disabled={(date) => date < new Date()}
    />
  </PopoverContent>
</Popover>
```

### Table with Actions Pattern
```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {data.map((item) => (
      <TableRow key={item.id}>
        <TableCell>{item.name}</TableCell>
        <TableCell>
          <Badge variant="default">{item.status}</Badge>
        </TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">⋮</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### Toast Notification Pattern
```tsx
import { useToast } from "@/components/ui/use-toast"

const { toast } = useToast()

// Success
toast({
  title: "Booking Confirmed",
  description: "Your appointment has been scheduled.",
})

// Error
toast({
  variant: "destructive",
  title: "Booking Failed",
  description: "Please try again or contact support.",
})
```

---

## Custom Badge Variants

Add to `components/ui/badge.tsx`:

```tsx
const badgeVariants = cva(
  "...", // existing base styles
  {
    variants: {
      variant: {
        default: "...",
        secondary: "...",
        destructive: "...",
        outline: "...",
        // Custom variants for booking system
        success: "border-transparent bg-green-500 text-white hover:bg-green-600",
        warning: "border-transparent bg-yellow-500 text-white hover:bg-yellow-600",
        info: "border-transparent bg-blue-500 text-white hover:bg-blue-600",
      },
    },
  }
)
```

---

## Status Badge Mapping

```tsx
const statusBadgeMap = {
  pending: { variant: "warning", label: "Pending" },
  confirmed: { variant: "info", label: "Confirmed" },
  paid: { variant: "success", label: "Paid" },
  completed: { variant: "default", label: "Completed" },
  cancelled: { variant: "destructive", label: "Cancelled" },
  no_show: { variant: "destructive", label: "No Show" },
}

// Usage
<Badge variant={statusBadgeMap[status].variant}>
  {statusBadgeMap[status].label}
</Badge>
```

---

## Responsive Navigation Pattern

```tsx
// Desktop: NavigationMenu
// Mobile: Sheet with navigation items

export function DashboardNav() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="ghost" size="icon">☰</Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="flex flex-col gap-4">
            {/* Navigation items */}
          </nav>
        </SheetContent>
      </Sheet>

      {/* Desktop */}
      <NavigationMenu className="hidden lg:flex">
        {/* Navigation items */}
      </NavigationMenu>
    </>
  )
}
```

---

## Form Validation Schemas

### Booking Schema
```tsx
import { z } from "zod"

export const bookingSchema = z.object({
  doctorId: z.string().min(1, "Please select a doctor"),
  date: z.date().min(new Date(), "Cannot book past dates"),
  bookingType: z.enum(["fast-track", "regular"]),
  timeSlot: z.string().optional(),
  patientName: z.string().min(2, "Name must be at least 2 characters"),
  patientPhone: z.string().regex(/^(\+62|0)[0-9]{9,12}$/, "Invalid phone number"),
  patientEmail: z.string().email().optional(),
  patientNotes: z.string().max(500).optional(),
  whatsappConsent: z.boolean().refine(val => val === true, "Consent required"),
  paymentMethod: z.enum(["qris", "bank_transfer", "credit_card"]).optional(),
}).refine(
  (data) => data.bookingType !== "fast-track" || data.timeSlot !== undefined,
  {
    message: "Time slot is required for fast-track bookings",
    path: ["timeSlot"],
  }
).refine(
  (data) => data.bookingType !== "fast-track" || data.paymentMethod !== undefined,
  {
    message: "Payment method is required for fast-track bookings",
    path: ["paymentMethod"],
  }
)
```

---

## Multi-Step Form State Management

```tsx
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

export function BookingForm() {
  const [step, setStep] = useState(1)
  const totalSteps = 5

  const form = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      bookingType: "regular",
      whatsappConsent: false,
    },
  })

  const bookingType = form.watch("bookingType")

  // Calculate actual total steps based on booking type
  const actualSteps = bookingType === "fast-track" ? 6 : 4

  const nextStep = () => {
    // Validate current step before proceeding
    setStep(prev => Math.min(prev + 1, actualSteps))
  }

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1))
  }

  return (
    <Form {...form}>
      <Progress value={(step / actualSteps) * 100} className="mb-4" />

      {step === 1 && <DoctorSelectionStep />}
      {step === 2 && <DateSelectionStep />}
      {step === 3 && <BookingTypeStep />}
      {step === 4 && bookingType === "fast-track" && <TimeSlotStep />}
      {step === (bookingType === "fast-track" ? 5 : 4) && <PatientInfoStep />}
      {step === 6 && bookingType === "fast-track" && <PaymentMethodStep />}

      <div className="flex justify-between mt-4">
        <Button onClick={prevStep} disabled={step === 1} variant="outline">
          Back
        </Button>
        <Button onClick={step === actualSteps ? form.handleSubmit(onSubmit) : nextStep}>
          {step === actualSteps ? "Submit" : "Next"}
        </Button>
      </div>
    </Form>
  )
}
```

---

## Loading State Patterns

### Skeleton Loaders
```tsx
// Table loading
<Table>
  <TableHeader>...</TableHeader>
  <TableBody>
    {[...Array(5)].map((_, i) => (
      <TableRow key={i}>
        <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
        <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
        <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>

// Card loading
<Card>
  <CardHeader>
    <Skeleton className="h-4 w-[150px]" />
  </CardHeader>
  <CardContent>
    <Skeleton className="h-12 w-full" />
  </CardContent>
</Card>
```

---

## Accessibility Checklist

### Form Accessibility
- [x] All inputs have associated labels
- [x] Required fields marked with aria-required
- [x] Error messages linked with aria-describedby
- [x] Keyboard navigation works (Tab, Enter, Escape)
- [x] Focus visible on all interactive elements

### Table Accessibility
- [x] Table has caption or aria-label
- [x] Table headers properly scoped
- [x] Sortable columns announce sort state
- [x] Keyboard navigation for row actions

### Dialog Accessibility
- [x] Focus trapped in dialog when open
- [x] Escape key closes dialog
- [x] Focus returns to trigger on close
- [x] Dialog has descriptive title

---

## Performance Optimization Tips

### Code Splitting
```tsx
// Lazy load admin dashboard
const AdminDashboard = lazy(() => import("@/components/AdminDashboard"))
const OwnerDashboard = lazy(() => import("@/components/OwnerDashboard"))

// Usage with Suspense
<Suspense fallback={<DashboardSkeleton />}>
  {role === "owner" ? <OwnerDashboard /> : <AdminDashboard />}
</Suspense>
```

### Debounced Search
```tsx
import { useDebouncedCallback } from "use-debounce"

const debouncedSearch = useDebouncedCallback(
  (value) => {
    // API call
    searchBookings(value)
  },
  300 // 300ms delay
)

<Input
  placeholder="Search bookings..."
  onChange={(e) => debouncedSearch(e.target.value)}
/>
```

### Virtual Scrolling for Large Tables
```tsx
import { useVirtualizer } from "@tanstack/react-virtual"

const rowVirtualizer = useVirtualizer({
  count: bookings.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 50,
})

// Render only visible rows
{rowVirtualizer.getVirtualItems().map((virtualRow) => (
  <TableRow key={virtualRow.index}>
    {/* Row content */}
  </TableRow>
))}
```

---

## Common Pitfalls & Solutions

### Pitfall 1: Calendar not updating after date selection
**Solution:** Ensure Calendar component is controlled
```tsx
<Calendar
  mode="single"
  selected={date}
  onSelect={(newDate) => {
    setDate(newDate)
    form.setValue("date", newDate) // Update form state
  }}
/>
```

### Pitfall 2: Form validation not triggering
**Solution:** Ensure FormField is properly wrapped
```tsx
// Wrong
<Input {...field} />

// Correct
<FormControl>
  <Input {...field} />
</FormControl>
```

### Pitfall 3: Toast not appearing
**Solution:** Ensure Toaster component is mounted
```tsx
// In root layout or _app.tsx
import { Toaster } from "@/components/ui/toaster"

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Toaster /> {/* Add this */}
      </body>
    </html>
  )
}
```

### Pitfall 4: Dialog closing on content click
**Solution:** Add onPointerDownOutside handler
```tsx
<DialogContent onPointerDownOutside={(e) => {
  // Prevent closing when clicking inside dialog
  if (e.target instanceof HTMLElement &&
      e.target.closest("[role='dialog']")) {
    e.preventDefault()
  }
}}>
  {/* Content */}
</DialogContent>
```

---

## Testing Utilities

### Component Testing with Vitest + Testing Library
```tsx
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { BookingForm } from "./BookingForm"

test("booking form submits with valid data", async () => {
  const user = userEvent.setup()
  const onSubmit = vi.fn()

  render(<BookingForm onSubmit={onSubmit} />)

  await user.selectOptions(screen.getByLabelText(/select doctor/i), "doctor-1")
  await user.click(screen.getByLabelText(/select date/i))
  await user.click(screen.getByText("15")) // Select 15th
  await user.type(screen.getByLabelText(/name/i), "John Doe")
  await user.type(screen.getByLabelText(/phone/i), "081234567890")
  await user.click(screen.getByLabelText(/whatsapp consent/i))

  await user.click(screen.getByRole("button", { name: /submit/i }))

  expect(onSubmit).toHaveBeenCalledWith({
    doctorId: "doctor-1",
    date: expect.any(Date),
    patientName: "John Doe",
    patientPhone: "081234567890",
    whatsappConsent: true,
  })
})
```

---

## Environment Variables

```env
# .env.local

# API
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Payment Gateway
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=your_midtrans_key
MIDTRANS_SERVER_KEY=your_server_key

# WhatsApp API
WHATSAPP_API_URL=https://api.whatsapp.com
WHATSAPP_API_KEY=your_whatsapp_key
WHATSAPP_BUSINESS_NUMBER=+628123456789

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/janjitemu

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# File Upload
UPLOAD_MAX_SIZE=5242880 # 5MB
ALLOWED_IMAGE_TYPES=image/jpeg,image/png,image/webp
```

---

## Project Structure Recommendation

```
janjitemu/
├── app/
│   ├── (auth)/
│   │   └── login/
│   ├── (patient)/
│   │   └── booking/
│   ├── (admin)/
│   │   ├── dashboard/
│   │   ├── doctors/
│   │   ├── schedule/
│   │   └── bookings/
│   └── (owner)/
│       ├── reports/
│       └── analytics/
├── components/
│   ├── ui/ (shadcn components)
│   ├── booking/
│   │   ├── DoctorSelection.tsx
│   │   ├── TimeSlotPicker.tsx
│   │   ├── PaymentInstructions.tsx
│   │   └── BookingConfirmation.tsx
│   ├── admin/
│   │   ├── DashboardLayout.tsx
│   │   ├── BookingsTable.tsx
│   │   ├── DoctorForm.tsx
│   │   └── ScheduleEditor.tsx
│   └── owner/
│       ├── RevenueMetrics.tsx
│       ├── CommissionTable.tsx
│       └── AnalyticsDashboard.tsx
├── lib/
│   ├── validations/ (Zod schemas)
│   ├── api/ (API client functions)
│   └── utils.ts
├── hooks/
│   ├── useBooking.ts
│   ├── useAuth.ts
│   └── useToast.ts
└── types/
    ├── booking.ts
    ├── doctor.ts
    └── user.ts
```

---

## Quick Command Reference

```bash
# Add single component
npx shadcn-ui@latest add button

# Add multiple components
npx shadcn-ui@latest add button input card

# Update component
npx shadcn-ui@latest add button --overwrite

# List available components
npx shadcn-ui@latest add

# Development
npm run dev

# Build
npm run build

# Type check
npm run type-check

# Lint
npm run lint

# Test
npm run test
```

---

## Resources

- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Radix UI Primitives](https://www.radix-ui.com)
- [React Hook Form](https://react-hook-form.com)
- [Zod Validation](https://zod.dev)
- [Recharts Documentation](https://recharts.org)
- [Date-fns Documentation](https://date-fns.org)
