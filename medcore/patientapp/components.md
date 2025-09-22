# Patient Appointment Booking App - shadcn/ui Components Mapping

## Overview

This document provides a comprehensive mapping of UI features from the Patient Appointment Booking Mobile Web App specification to appropriate shadcn/ui components. The app is designed as a Flutter PWA, but this mapping translates the requirements to React-based shadcn/ui components for implementation reference.

## Core Component Requirements

### Essential shadcn/ui Components Needed

```bash
# Form & Input Components
npx shadcn-ui@latest add form
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add select
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add radio-group
npx shadcn-ui@latest add switch

# Navigation & Layout
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add sheet
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add navigation-menu

# Data Display
npx shadcn-ui@latest add table
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add separator
npx shadcn-ui@latest add progress
npx shadcn-ui@latest add skeleton

# Feedback & Overlays
npx shadcn-ui@latest add alert
npx shadcn-ui@latest add alert-dialog
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add tooltip
npx shadcn-ui@latest add popover

# Date & Time
npx shadcn-ui@latest add calendar
npx shadcn-ui@latest add date-picker

# Utilities
npx shadcn-ui@latest add scroll-area
npx shadcn-ui@latest add command
npx shadcn-ui@latest add slider
```

## Feature-Based Component Mapping

### 1. Authentication Module

#### 1.1 Login/Registration Forms
**Spec Requirements:** Multi-channel authentication (Google, Facebook, Phone), user registration with required/optional fields

**shadcn/ui Components:**
- `Form` - Form validation and submission
- `Input` - Email, phone number, name fields
- `Label` - Form field labels
- `Button` - Submit buttons with loading states
- `Card` - Login/registration card containers
- `Separator` - Social login dividers
- `Alert` - Error messages and validation feedback

**Implementation Pattern:**
```tsx
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Multi-step registration form
<Card className="w-full max-w-md">
  <CardHeader>
    <CardTitle>Create Account</CardTitle>
  </CardHeader>
  <CardContent>
    <Form {...form}>
      <FormField
        control={form.control}
        name="fullName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter your full name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {/* More fields... */}
      <Button type="submit" className="w-full">
        Create Account
      </Button>
    </Form>
  </CardContent>
</Card>
```

#### 1.2 OTP Verification
**Spec Requirements:** Auto-read OTP, country code selector, retry mechanism

**shadcn/ui Components:**
- `Input` - OTP digit inputs
- `Select` - Country code selector
- `Button` - Resend OTP button
- `Badge` - Timer countdown display

**Custom Component Needed:**
```tsx
// OTPInput component built on shadcn Input
const OTPInput = ({ length = 6, onComplete }) => {
  return (
    <div className="flex gap-2">
      {Array.from({ length }).map((_, index) => (
        <Input
          key={index}
          className="w-12 h-12 text-center text-lg"
          maxLength={1}
          // Auto-focus logic and validation
        />
      ))}
    </div>
  )
}
```

### 2. Doctor Discovery Module

#### 2.1 Search & Filter Interface
**Spec Requirements:** Search by name/specialization/location, multiple filter options, auto-complete

**shadcn/ui Components:**
- `Command` - Search with auto-complete functionality
- `Input` - Search input field
- `Sheet` - Filter sidebar/bottom sheet
- `Checkbox` - Multiple selection filters
- `Slider` - Price range and radius filters
- `Badge` - Active filter indicators
- `Button` - Apply/clear filters

**Implementation Pattern:**
```tsx
import { Command, CommandInput, CommandList, CommandItem } from "@/components/ui/command"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"

// Search with filters
<div className="space-y-4">
  <Command>
    <CommandInput placeholder="Search doctors, specializations..." />
    <CommandList>
      {searchResults.map((doctor) => (
        <CommandItem key={doctor.id}>
          {doctor.name} - {doctor.specialization}
        </CommandItem>
      ))}
    </CommandList>
  </Command>

  <Sheet>
    <SheetTrigger asChild>
      <Button variant="outline">Filters</Button>
    </SheetTrigger>
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Filter Doctors</SheetTitle>
      </SheetHeader>
      {/* Filter options */}
    </SheetContent>
  </Sheet>
</div>
```

#### 2.2 Doctor Profile Cards
**Spec Requirements:** Doctor photo, credentials, ratings, languages, fees, insurance

**shadcn/ui Components:**
- `Card` - Doctor profile containers
- `Avatar` - Doctor profile pictures
- `Badge` - Specializations, languages, ratings
- `Separator` - Section dividers
- `Button` - View profile/book appointment actions

**Implementation Pattern:**
```tsx
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

<Card className="hover:shadow-lg transition-shadow">
  <CardHeader className="pb-2">
    <div className="flex items-start gap-3">
      <Avatar className="w-16 h-16">
        <AvatarImage src={doctor.imageUrl} />
        <AvatarFallback>{doctor.initials}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <h3 className="font-semibold">{doctor.name}</h3>
        <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
        <div className="flex items-center gap-1 mt-1">
          <Badge variant="secondary">{doctor.rating} ★</Badge>
          <span className="text-xs text-muted-foreground">
            ({doctor.reviewCount} reviews)
          </span>
        </div>
      </div>
    </div>
  </CardHeader>
  <CardContent>
    {/* Languages, fees, insurance info */}
    <Button className="w-full mt-3">Book Appointment</Button>
  </CardContent>
</Card>
```

### 3. Schedule Viewing & Calendar

#### 3.1 Weekly Schedule Display
**Spec Requirements:** 7-day horizontal scrollable view, session divisions, availability indicators

**shadcn/ui Components:**
- `ScrollArea` - Horizontal scrolling container
- `Card` - Time slot containers
- `Badge` - Available slot counts
- `Button` - Navigation arrows and time slot selection

**Custom Component Needed:**
```tsx
// WeeklyScheduleView component
const WeeklyScheduleView = ({ doctorId, selectedDate, onDateSelect }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="icon">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="font-medium">Week of {formatWeekRange(currentWeek)}</span>
        <Button variant="outline" size="icon">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="w-full">
        <div className="flex gap-2 pb-2">
          {weekDays.map((day) => (
            <Card
              key={day.date}
              className={`min-w-[120px] cursor-pointer ${
                isSelected(day.date) ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => onDateSelect(day.date)}
            >
              <CardContent className="p-3">
                <div className="text-center">
                  <p className="text-sm font-medium">{day.dayName}</p>
                  <p className="text-lg">{day.date}</p>
                  <Badge variant={day.hasSlots ? 'default' : 'secondary'}>
                    {day.availableSlots} slots
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
```

#### 3.2 Calendar Integration
**Spec Requirements:** Month view, visual indicators, swipe navigation, availability markers

**shadcn/ui Components:**
- `Calendar` - Base calendar component
- `Badge` - Availability indicators
- `Button` - Month navigation

**Enhanced Calendar Implementation:**
```tsx
import { Calendar } from "@/components/ui/calendar"

// Custom calendar with availability indicators
const AvailabilityCalendar = ({ availableDates, onDateSelect }) => {
  const [date, setDate] = useState(new Date())

  const modifiers = {
    available: availableDates,
    limited: limitedDates,
    unavailable: unavailableDates
  }

  const modifiersStyles = {
    available: { backgroundColor: '#10B981', color: 'white' },
    limited: { backgroundColor: '#F59E0B', color: 'white' },
    unavailable: { backgroundColor: '#EF4444', color: 'white' }
  }

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      modifiers={modifiers}
      modifiersStyles={modifiersStyles}
      className="rounded-md border"
    />
  )
}
```

### 4. Appointment Booking Flow

#### 4.1 Time Slot Selection
**Spec Requirements:** Multiple time ranges, slot duration display, available counts, grid/list toggle

**shadcn/ui Components:**
- `Tabs` - Morning/Afternoon/Evening sessions
- `RadioGroup` - Time slot selection
- `Badge` - Duration and availability indicators
- `Button` - Grid/list view toggle
- `Card` - Time slot containers

**Implementation Pattern:**
```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

<Tabs defaultValue="morning" className="w-full">
  <TabsList className="grid w-full grid-cols-3">
    <TabsTrigger value="morning">Morning</TabsTrigger>
    <TabsTrigger value="afternoon">Afternoon</TabsTrigger>
    <TabsTrigger value="evening">Evening</TabsTrigger>
  </TabsList>

  <TabsContent value="morning" className="space-y-4">
    <RadioGroup onValueChange={setSelectedSlot}>
      <div className="grid grid-cols-2 gap-2">
        {morningSlots.map((slot) => (
          <div key={slot.id} className="flex items-center space-x-2">
            <RadioGroupItem
              value={slot.id}
              id={slot.id}
              disabled={!slot.available}
            />
            <Card className="flex-1 p-3">
              <div className="text-sm font-medium">{slot.time}</div>
              <div className="text-xs text-muted-foreground">
                {slot.duration} min
              </div>
              <Badge variant={slot.available ? 'default' : 'secondary'}>
                {slot.available ? 'Available' : 'Booked'}
              </Badge>
            </Card>
          </div>
        ))}
      </div>
    </RadioGroup>
  </TabsContent>
</Tabs>
```

#### 4.2 Booking Information Form
**Spec Requirements:** Reason for visit, symptoms checklist, file upload, special requirements

**shadcn/ui Components:**
- `Form` - Booking details form
- `Select` - Reason for visit dropdown
- `Checkbox` - Symptoms checklist
- `Textarea` - Special requirements
- `Button` - File upload trigger
- `Alert` - Important instructions

**Implementation Pattern:**
```tsx
<Form {...bookingForm}>
  <FormField
    control={bookingForm.control}
    name="reasonForVisit"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Reason for Visit</FormLabel>
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Select reason" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectItem value="consultation">General Consultation</SelectItem>
            <SelectItem value="followup">Follow-up</SelectItem>
            <SelectItem value="checkup">Regular Checkup</SelectItem>
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    )}
  />

  <FormField
    control={bookingForm.control}
    name="symptoms"
    render={() => (
      <FormItem>
        <div className="mb-4">
          <FormLabel className="text-base">Symptoms (check all that apply)</FormLabel>
        </div>
        {symptomsList.map((symptom) => (
          <FormField
            key={symptom.id}
            control={bookingForm.control}
            name="symptoms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value?.includes(symptom.id)}
                    onCheckedChange={(checked) => {
                      return checked
                        ? field.onChange([...field.value, symptom.id])
                        : field.onChange(field.value?.filter((value) => value !== symptom.id))
                    }}
                  />
                </FormControl>
                <FormLabel className="font-normal">
                  {symptom.label}
                </FormLabel>
              </FormItem>
            )}
          />
        ))}
        <FormMessage />
      </FormItem>
    )}
  />
</Form>
```

### 5. Care Plan Dashboard

#### 5.1 Dashboard Layout
**Spec Requirements:** Header with patient info, upcoming appointment card, preparation checklist

**shadcn/ui Components:**
- `Card` - Dashboard sections
- `Avatar` - Patient profile picture
- `Badge` - Medical ID, status indicators
- `Button` - Quick actions
- `Separator` - Section dividers
- `Progress` - Preparation progress

**Implementation Pattern:**
```tsx
<div className="space-y-6 p-4">
  {/* Header Section */}
  <Card>
    <CardHeader>
      <div className="flex items-center gap-4">
        <Avatar className="w-16 h-16">
          <AvatarImage src={patient.imageUrl} />
          <AvatarFallback>{patient.initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h2 className="text-xl font-semibold">{patient.name}</h2>
          <p className="text-sm text-muted-foreground">ID: {patient.medicalId}</p>
          <div className="flex gap-2 mt-2">
            <Button size="sm" variant="outline">Edit Profile</Button>
            <Button size="sm" variant="outline">Medical Records</Button>
          </div>
        </div>
      </div>
    </CardHeader>
  </Card>

  {/* Upcoming Appointment */}
  <Card>
    <CardHeader>
      <CardTitle>Upcoming Appointment</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex items-start gap-4">
        <Avatar>
          <AvatarImage src={appointment.doctor.imageUrl} />
          <AvatarFallback>{appointment.doctor.initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-semibold">{appointment.doctor.name}</h3>
          <p className="text-sm text-muted-foreground">
            {appointment.doctor.specialization}
          </p>
          <div className="mt-2 space-y-1">
            <p className="text-sm">
              📅 {formatDate(appointment.dateTime)}
            </p>
            <p className="text-sm">
              📍 {appointment.clinic.name}
            </p>
          </div>
          <div className="flex gap-2 mt-3">
            <Button size="sm" variant="outline">Reschedule</Button>
            <Button size="sm" variant="outline">Cancel</Button>
            <Button size="sm">Add to Calendar</Button>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</div>
```

### 6. Patient Journey Tracking

#### 6.1 Real-time Status Updates
**Spec Requirements:** Journey stages, real-time updates, queue position, estimated wait time

**shadcn/ui Components:**
- `Progress` - Journey progress indicator
- `Badge` - Current status
- `Card` - Status update containers
- `Separator` - Stage dividers
- `Skeleton` - Loading states for updates

**Custom Journey Component:**
```tsx
const PatientJourneyTracker = ({ appointmentId, currentStage, stages }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Journey</CardTitle>
        <CardDescription>
          Track your appointment progress in real-time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round((currentStage / stages.length) * 100)}%</span>
            </div>
            <Progress
              value={(currentStage / stages.length) * 100}
              className="w-full"
            />
          </div>

          {/* Journey Stages */}
          <div className="space-y-3">
            {stages.map((stage, index) => (
              <div key={stage.id} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index < currentStage
                    ? 'bg-primary text-primary-foreground'
                    : index === currentStage
                    ? 'bg-primary/20 text-primary border-2 border-primary'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {index < currentStage ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <span className="text-xs">{index + 1}</span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{stage.title}</p>
                  {stage.description && (
                    <p className="text-xs text-muted-foreground">
                      {stage.description}
                    </p>
                  )}
                  {index === currentStage && stage.estimatedTime && (
                    <Badge variant="secondary" className="mt-1">
                      Est. {stage.estimatedTime} min
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
```

### 7. Payment Module

#### 7.1 Payment Methods Interface
**Spec Requirements:** Debit card, QRIS, Virtual Account with multiple providers

**shadcn/ui Components:**
- `Tabs` - Payment method selection
- `Form` - Payment details forms
- `Input` - Card number, CVV, account details
- `Select` - Bank selection, expiry date
- `Button` - Payment confirmation
- `Alert` - Payment instructions and errors
- `Dialog` - 3D Secure authentication

**Implementation Pattern:**
```tsx
<Tabs defaultValue="card" className="w-full">
  <TabsList className="grid w-full grid-cols-3">
    <TabsTrigger value="card">💳 Card</TabsTrigger>
    <TabsTrigger value="qris">📱 QRIS</TabsTrigger>
    <TabsTrigger value="va">🏦 Virtual Account</TabsTrigger>
  </TabsList>

  <TabsContent value="card" className="space-y-4">
    <Form {...cardForm}>
      <FormField
        control={cardForm.control}
        name="cardNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Card Number</FormLabel>
            <FormControl>
              <Input
                placeholder="1234 5678 9012 3456"
                {...field}
                onChange={(e) => {
                  // Format card number with spaces
                  const formatted = e.target.value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ')
                  field.onChange(formatted)
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={cardForm.control}
          name="expiryDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expiry Date</FormLabel>
              <FormControl>
                <Input placeholder="MM/YY" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={cardForm.control}
          name="cvv"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CVV</FormLabel>
              <FormControl>
                <Input placeholder="123" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </Form>
  </TabsContent>

  <TabsContent value="qris" className="space-y-4">
    <Alert>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>QRIS Payment</AlertTitle>
      <AlertDescription>
        Scan the QR code with your mobile banking app or e-wallet
      </AlertDescription>
    </Alert>

    <div className="flex justify-center p-8">
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <QRCode value={qrisCode} size={200} />
      </div>
    </div>

    <div className="text-center space-y-2">
      <p className="text-sm text-muted-foreground">
        Payment expires in <Badge variant="outline">09:45</Badge>
      </p>
      <Button variant="outline" size="sm">
        Copy Payment Code
      </Button>
    </div>
  </TabsContent>

  <TabsContent value="va" className="space-y-4">
    <FormField
      control={vaForm.control}
      name="bank"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Select Bank</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Choose your bank" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="bca">BCA</SelectItem>
              <SelectItem value="mandiri">Mandiri</SelectItem>
              <SelectItem value="bni">BNI</SelectItem>
              <SelectItem value="bri">BRI</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />

    {vaDetails && (
      <Alert>
        <AlertTitle>Virtual Account Number</AlertTitle>
        <AlertDescription>
          <div className="space-y-2 mt-2">
            <div className="flex justify-between items-center">
              <span className="font-mono text-lg">{vaDetails.accountNumber}</span>
              <Button size="sm" variant="outline">Copy</Button>
            </div>
            <p className="text-xs">
              Transfer exactly <strong>{formatCurrency(amount)}</strong> to this account
            </p>
          </div>
        </AlertDescription>
      </Alert>
    )}
  </TabsContent>
</Tabs>
```

#### 7.2 Billing Summary
**Spec Requirements:** Fee breakdown, insurance coverage, total calculations

**shadcn/ui Components:**
- `Card` - Billing summary container
- `Separator` - Line item dividers
- `Badge` - Discount indicators
- `Table` - Detailed breakdown (if needed)

```tsx
<Card>
  <CardHeader>
    <CardTitle>Billing Summary</CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    <div className="space-y-2">
      <div className="flex justify-between">
        <span>Consultation Fee</span>
        <span>{formatCurrency(billing.consultationFee)}</span>
      </div>

      {billing.additionalProcedures.map((procedure) => (
        <div key={procedure.id} className="flex justify-between">
          <span className="text-sm text-muted-foreground">{procedure.name}</span>
          <span className="text-sm">{formatCurrency(procedure.fee)}</span>
        </div>
      ))}

      <Separator />

      <div className="flex justify-between">
        <span>Subtotal</span>
        <span>{formatCurrency(billing.subtotal)}</span>
      </div>

      {billing.insuranceCoverage > 0 && (
        <div className="flex justify-between text-green-600">
          <span className="flex items-center gap-2">
            Insurance Coverage
            <Badge variant="secondary">-{billing.insurancePercentage}%</Badge>
          </span>
          <span>-{formatCurrency(billing.insuranceCoverage)}</span>
        </div>
      )}

      <Separator />

      <div className="flex justify-between text-lg font-semibold">
        <span>Total Payable</span>
        <span>{formatCurrency(billing.totalPayable)}</span>
      </div>
    </div>
  </CardContent>
</Card>
```

### 8. Multilingual Support

#### 8.1 Language Toggle Component
**Spec Requirements:** Animated language switcher with flag icons, smooth flip animation

**shadcn/ui Components:**
- `Button` - Language toggle trigger
- Custom animated component for flip effect

**Custom Implementation:**
```tsx
const LanguageToggle = () => {
  const [currentLang, setCurrentLang] = useState('en')
  const [isFlipping, setIsFlipping] = useState(false)

  const toggleLanguage = () => {
    setIsFlipping(true)
    setTimeout(() => {
      setCurrentLang(prev => prev === 'en' ? 'id' : 'en')
      setIsFlipping(false)
    }, 300)
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className={`relative overflow-hidden transition-transform duration-600 ${
        isFlipping ? 'scale-x-0' : 'scale-x-100'
      }`}
      style={{
        transformStyle: 'preserve-3d',
        transform: isFlipping ? 'rotateY(180deg)' : 'rotateY(0deg)'
      }}
    >
      <div className="flex items-center gap-2">
        {currentLang === 'en' ? (
          <>
            <span className="text-lg">🇺🇸</span>
            <span>EN</span>
          </>
        ) : (
          <>
            <span className="text-lg">🇮🇩</span>
            <span>ID</span>
          </>
        )}
      </div>
    </Button>
  )
}
```

### 9. Loading & Feedback States

#### 9.1 Loading States
**Spec Requirements:** Shimmer loading, skeleton states, pull-to-refresh

**shadcn/ui Components:**
- `Skeleton` - Content placeholders
- `Button` - Loading states with spinners

**Implementation Patterns:**
```tsx
// Doctor card skeleton
const DoctorCardSkeleton = () => (
  <Card>
    <CardHeader className="pb-2">
      <div className="flex items-start gap-3">
        <Skeleton className="w-16 h-16 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-12" />
            <Skeleton className="h-5 w-16" />
          </div>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <Skeleton className="h-9 w-full" />
    </CardContent>
  </Card>
)

// Loading button states
<Button disabled={isLoading}>
  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
  {isLoading ? 'Booking...' : 'Book Appointment'}
</Button>
```

### 10. Responsive Design Implementation

#### 10.1 Breakpoint Strategy
**Spec Requirements:** Mobile-first design, 320px-768px range, adaptive layouts

**shadcn/ui + Tailwind Implementation:**
```tsx
// Responsive grid layouts
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {doctors.map((doctor) => (
    <DoctorCard key={doctor.id} doctor={doctor} />
  ))}
</div>

// Responsive navigation
<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
  <h1 className="text-2xl font-bold">Find Doctors</h1>
  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
    <Button variant="outline" className="w-full sm:w-auto">
      Filters
    </Button>
    <Button className="w-full sm:w-auto">
      Search
    </Button>
  </div>
</div>

// Responsive cards
<Card className="w-full max-w-sm sm:max-w-md lg:max-w-lg">
  <CardContent className="p-4 sm:p-6">
    {/* Card content */}
  </CardContent>
</Card>
```

#### 10.2 Mobile-Optimized Components
```tsx
// Mobile-friendly date picker
const MobileDatePicker = () => (
  <Sheet>
    <SheetTrigger asChild>
      <Button variant="outline" className="w-full justify-start">
        <Calendar className="mr-2 h-4 w-4" />
        {selectedDate ? format(selectedDate, 'PPP') : 'Select date'}
      </Button>
    </SheetTrigger>
    <SheetContent side="bottom" className="h-[400px]">
      <SheetHeader>
        <SheetTitle>Select Date</SheetTitle>
      </SheetHeader>
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        className="w-full"
      />
    </SheetContent>
  </Sheet>
)

// Mobile navigation menu
const MobileNav = () => (
  <Sheet>
    <SheetTrigger asChild>
      <Button variant="ghost" size="icon" className="md:hidden">
        <Menu className="h-6 w-6" />
      </Button>
    </SheetTrigger>
    <SheetContent side="left">
      <nav className="space-y-4">
        <a href="/search" className="block py-2">Find Doctors</a>
        <a href="/appointments" className="block py-2">My Appointments</a>
        <a href="/care-plan" className="block py-2">Care Plan</a>
        <a href="/profile" className="block py-2">Profile</a>
      </nav>
    </SheetContent>
  </Sheet>
)
```

## Custom Components Required

### 1. Advanced Calendar with Availability
Based on shadcn Calendar but with custom availability overlays and responsive mobile view.

### 2. Multi-Step Form Wizard
Combines shadcn Form components with step progress indicators and validation.

### 3. Real-time Journey Tracker
Custom component using shadcn Progress and Badge components with WebSocket updates.

### 4. Animated Language Toggle
Custom 3D flip animation component using shadcn Button as base.

### 5. Payment Method Selector
Combines shadcn Tabs, Form, and Input components with payment provider specific validations.

### 6. Doctor Search with Filters
Advanced search using shadcn Command component with custom filter panel.

### 7. Time Slot Grid
Custom grid component using shadcn RadioGroup and Card components.

## Animation Integration

While shadcn/ui provides the structural components, animations would be implemented using:
- **Framer Motion** for complex animations
- **Tailwind CSS transitions** for simple hover and focus states
- **CSS-in-JS** for 3D transforms (language toggle)

## Accessibility Considerations

All shadcn/ui components come with built-in accessibility features:
- Proper ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- High contrast mode support

## Implementation Priority

### Phase 1 (Core Features)
1. Authentication forms with OTP
2. Doctor search and filtering
3. Basic calendar and scheduling
4. Simple booking flow

### Phase 2 (Enhanced UX)
1. Advanced calendar with availability
2. Real-time journey tracking
3. Payment integration
4. Language switching

### Phase 3 (Polish)
1. Micro-animations
2. Advanced responsive layouts
3. Performance optimizations
4. Accessibility enhancements

This mapping provides a comprehensive foundation for implementing the Patient Appointment Booking app using shadcn/ui components while maintaining the design system requirements and user experience goals outlined in the specification.