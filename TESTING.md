# 🧪 Testing Guide

## Manual Testing Checklist

### Form Validation Testing

#### Test Case 1: Empty Form Submission
- [ ] Click "Add Appointment" without filling any fields
- [ ] Expected: Error messages appear for required fields
- [ ] Status: ✅ Pass / ❌ Fail

#### Test Case 2: Past Date Validation
- [ ] Enter a past date
- [ ] Expected: Error message "Cannot book past dates"
- [ ] Status: ✅ Pass / ❌ Fail

#### Test Case 3: Invalid Email
- [ ] Enter "invalidemail" in email field
- [ ] Expected: Error message "Invalid email"
- [ ] Status: ✅ Pass / ❌ Fail

#### Test Case 4: Invalid Phone
- [ ] Enter "123" in phone field
- [ ] Expected: Error message "Invalid phone (10 digits)"
- [ ] Status: ✅ Pass / ❌ Fail

#### Test Case 5: Valid Submission
- [ ] Fill all required fields correctly
- [ ] Expected: Appointment added to list, form cleared
- [ ] Status: ✅ Pass / ❌ Fail

### CRUD Operations Testing

#### Test Case 6: Create Appointment
- [ ] Add new appointment with all details
- [ ] Expected: Appears in list with "Pending" status
- [ ] Status: ✅ Pass / ❌ Fail

#### Test Case 7: Edit Appointment
- [ ] Click edit button, modify fields, save
- [ ] Expected: Changes reflected in list
- [ ] Status: ✅ Pass / ❌ Fail

#### Test Case 8: Delete Appointment
- [ ] Click delete button
- [ ] Expected: Appointment removed from list
- [ ] Status: ✅ Pass / ❌ Fail

#### Test Case 9: Update Status
- [ ] Click complete button on pending appointment
- [ ] Expected: Status changes to "Completed"
- [ ] Status: ✅ Pass / ❌ Fail

### Search & Filter Testing

#### Test Case 10: Search Functionality
- [ ] Type name in search box
- [ ] Expected: List filters in real-time
- [ ] Status: ✅ Pass / ❌ Fail

#### Test Case 11: Status Filter
- [ ] Select "Completed" from filter dropdown
- [ ] Expected: Only completed appointments shown
- [ ] Status: ✅ Pass / ❌ Fail

#### Test Case 12: Sort by Date
- [ ] Select "Sort by Date"
- [ ] Expected: Appointments ordered chronologically
- [ ] Status: ✅ Pass / ❌ Fail

#### Test Case 13: Sort by Name
- [ ] Select "Sort by Name"
- [ ] Expected: Appointments ordered alphabetically
- [ ] Status: ✅ Pass / ❌ Fail

### Data Persistence Testing

#### Test Case 14: LocalStorage Save
- [ ] Add appointments, refresh page
- [ ] Expected: All appointments still present
- [ ] Status: ✅ Pass / ❌ Fail

#### Test Case 15: Clear All
- [ ] Click "Clear All" button
- [ ] Expected: Confirmation dialog, then all appointments removed
- [ ] Status: ✅ Pass / ❌ Fail

### Export Functionality Testing

#### Test Case 16: CSV Export
- [ ] Click "Export CSV" button
- [ ] Expected: CSV file downloads with correct data
- [ ] Status: ✅ Pass / ❌ Fail

#### Test Case 17: CSV Content Validation
- [ ] Open exported CSV file
- [ ] Expected: All appointment data present and formatted correctly
- [ ] Status: ✅ Pass / ❌ Fail

### Dark Mode Testing

#### Test Case 18: Theme Toggle
- [ ] Click theme toggle button
- [ ] Expected: UI switches to dark mode
- [ ] Status: ✅ Pass / ❌ Fail

#### Test Case 19: Theme Persistence
- [ ] Toggle dark mode, refresh page
- [ ] Expected: Dark mode preference maintained
- [ ] Status: ✅ Pass / ❌ Fail

### Responsive Design Testing

#### Test Case 20: Mobile View (< 768px)
- [ ] Resize browser to mobile width
- [ ] Expected: Layout adapts, all features accessible
- [ ] Status: ✅ Pass / ❌ Fail

#### Test Case 21: Tablet View (768px - 1024px)
- [ ] Resize browser to tablet width
- [ ] Expected: Optimal layout for medium screens
- [ ] Status: ✅ Pass / ❌ Fail

#### Test Case 22: Desktop View (> 1024px)
- [ ] View on desktop resolution
- [ ] Expected: Full-featured layout with proper spacing
- [ ] Status: ✅ Pass / ❌ Fail

### Edge Cases Testing

#### Test Case 23: Empty State
- [ ] Clear all appointments
- [ ] Expected: "No appointments found" message displayed
- [ ] Status: ✅ Pass / ❌ Fail

#### Test Case 24: Large Dataset
- [ ] Add 50+ appointments
- [ ] Expected: Performance remains smooth, scrolling works
- [ ] Status: ✅ Pass / ❌ Fail

#### Test Case 25: Special Characters
- [ ] Enter special characters in name field
- [ ] Expected: Handled correctly without errors
- [ ] Status: ✅ Pass / ❌ Fail

### Browser Compatibility Testing

#### Test Case 26: Chrome
- [ ] Test all features in Chrome
- [ ] Status: ✅ Pass / ❌ Fail

#### Test Case 27: Firefox
- [ ] Test all features in Firefox
- [ ] Status: ✅ Pass / ❌ Fail

#### Test Case 28: Safari
- [ ] Test all features in Safari
- [ ] Status: ✅ Pass / ❌ Fail

#### Test Case 29: Edge
- [ ] Test all features in Edge
- [ ] Status: ✅ Pass / ❌ Fail

## Automated Testing (Future Implementation)

### Unit Tests
```javascript
// Example test structure
describe('AppointmentForm', () => {
  test('validates required fields', () => {
    // Test implementation
  });
  
  test('prevents past date selection', () => {
    // Test implementation
  });
});
```

### Integration Tests
```javascript
describe('Appointment Management Flow', () => {
  test('creates and displays appointment', () => {
    // Test implementation
  });
  
  test('edits existing appointment', () => {
    // Test implementation
  });
});
```

## Performance Testing

### Metrics to Monitor
- [ ] Initial load time < 2 seconds
- [ ] Search response time < 100ms
- [ ] Smooth animations (60fps)
- [ ] Memory usage stable over time

## Accessibility Testing

### WCAG Compliance
- [ ] Keyboard navigation works
- [ ] Form labels properly associated
- [ ] Color contrast meets standards
- [ ] Error messages are clear

## Security Testing

### Input Validation
- [ ] XSS prevention tested
- [ ] SQL injection not applicable (no backend)
- [ ] LocalStorage data sanitized

## Bug Reporting Template

```
**Bug Title:** [Brief description]

**Steps to Reproduce:**
1. Step one
2. Step two
3. Step three

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

**Environment:**
- Browser: [Chrome/Firefox/Safari/Edge]
- Version: [Browser version]
- OS: [Windows/Mac/Linux]

**Screenshots:**
[Attach if applicable]

**Priority:** [High/Medium/Low]
```

## Testing Tools

### Recommended Tools
- **React Developer Tools**: Component inspection
- **Chrome DevTools**: Performance profiling
- **Lighthouse**: Performance and accessibility audit
- **BrowserStack**: Cross-browser testing
- **Jest**: Unit testing framework
- **React Testing Library**: Component testing

## Test Coverage Goals

- [ ] 80%+ code coverage
- [ ] All critical paths tested
- [ ] Edge cases covered
- [ ] Error handling verified

---

**Note:** Run through this checklist before each release or major update.
