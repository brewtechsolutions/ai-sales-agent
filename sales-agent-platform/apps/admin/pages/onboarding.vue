<template>
  <div
    class="
      min-h-screen
      flex items-center justify-center
      p-4
      bg-background dark:bg-dark-background
    "
  >
    <div
      class="
        w-full max-w-2xl
        bg-card dark:bg-dark-card
        rounded-ios-xl shadow-ios-xl
        border border-border dark:border-dark-border
        p-6
        md:p-8
        lg:p-10
      "
    >
      <!-- Header -->
      <div class="text-center mb-8">
        <div
          class="
            inline-flex items-center justify-center
            w-16 h-16 mb-4
            rounded-full
            bg-primary/10 dark:bg-primary/20
          "
        >
          <Icon
            name="heroicons:building-office"
            class="w-8 h-8 text-primary"
          />
        </div>
        <h1
          class="
            text-2xl font-bold mb-2
            md:text-3xl
            text-text-primary dark:text-dark-text-primary
          "
        >
          Welcome! Let's Get Started
        </h1>
        <p
          class="
            text-base
            md:text-lg
            text-text-secondary dark:text-dark-text-secondary
          "
        >
          <span v-if="user?.role === 'company_user'">
            Join a company using an invite code to get started
          </span>
          <span v-else-if="user?.role === 'company_admin'">
            Create a new organization or manage your existing companies
          </span>
          <span v-else>
            You need to join or create a company to continue
          </span>
        </p>
      </div>

      <!-- Options (shown when no form is active) -->
      <Transition name="fade">
        <div v-if="!showJoinForm && !showCreateForm" class="flex flex-col gap-4 mb-6">
          <!-- Join Company Option (only for company_user role) -->
          <button
            v-if="user?.role === 'company_user'"
            @click="handleSelectJoin"
            :disabled="isLoading"
            class="
              w-full
              flex items-center justify-between
              p-6
              bg-surface dark:bg-dark-surface
              rounded-ios-lg
              border-2 border-border dark:border-dark-border
              text-left
              transition-all duration-300
              hover:border-primary/50 dark:hover:border-primary/50
              hover:shadow-ios
              focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            <div class="flex items-center gap-4">
              <div
                class="
                  w-12 h-12
                  rounded-full
                  bg-primary/10 dark:bg-primary/20
                  flex items-center justify-center
                "
              >
                <Icon
                  name="heroicons:user-plus"
                  class="w-6 h-6 text-primary"
                />
              </div>
              <div>
                <h3
                  class="
                    font-semibold text-lg mb-1
                    text-text-primary dark:text-dark-text-primary
                  "
                >
                  Join Existing Company
                </h3>
                <p
                  class="
                    text-sm
                    text-text-secondary dark:text-dark-text-secondary
                  "
                >
                  Use an invite code to join a company
                </p>
              </div>
            </div>
            <Icon
              name="heroicons:chevron-right"
              class="w-5 h-5 text-text-secondary dark:text-dark-text-secondary"
            />
          </button>

          <!-- Create Company Option (only for company_admin role) -->
          <button
            v-if="user?.role === 'company_admin'"
            @click="handleSelectCreate"
            :disabled="isLoading"
            class="
              w-full
              flex items-center justify-between
              p-6
              bg-surface dark:bg-dark-surface
              rounded-ios-lg
              border-2 border-border dark:border-dark-border
              text-left
              transition-all duration-300
              hover:border-primary/50 dark:hover:border-primary/50
              hover:shadow-ios
              focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            <div class="flex items-center gap-4">
              <div
                class="
                  w-12 h-12
                  rounded-full
                  bg-success/10 dark:bg-success/20
                  flex items-center justify-center
                "
              >
                <Icon
                  name="heroicons:plus-circle"
                  class="w-6 h-6 text-success"
                />
              </div>
              <div>
                <h3
                  class="
                    font-semibold text-lg mb-1
                    text-text-primary dark:text-dark-text-primary
                  "
                >
                  Create New Company
                </h3>
                <p
                  class="
                    text-sm
                    text-text-secondary dark:text-dark-text-secondary
                  "
                >
                  Create a new organization and manage multiple companies
                </p>
              </div>
            </div>
            <Icon
              name="heroicons:chevron-right"
              class="w-5 h-5 text-text-secondary dark:text-dark-text-secondary"
            />
          </button>
        </div>
      </Transition>

      <!-- Join Company Form -->
      <Transition name="slide">
        <div
          v-if="showJoinForm"
          class="
            p-6
            bg-surface dark:bg-dark-surface
            rounded-ios-lg
            border border-border dark:border-dark-border
            mb-4
          "
        >
          <!-- Back Button -->
          <button
            type="button"
            @click="handleBackToOptions"
            :disabled="isLoading"
            class="
              flex items-center gap-2 mb-4
              text-text-secondary dark:text-dark-text-secondary
              hover:text-text-primary dark:hover:text-dark-text-primary
              transition-colors duration-200
              disabled:opacity-50
            "
          >
            <Icon
              name="heroicons:arrow-left"
              class="w-5 h-5"
            />
            <span class="text-sm font-medium">Back</span>
          </button>

          <h3
            class="
              text-lg font-semibold mb-4
              text-text-primary dark:text-dark-text-primary
            "
          >
            Join with Invite Code
          </h3>
          <form @submit.prevent="handleJoinCompany" class="space-y-4">
            <div>
              <label
                for="inviteCode"
                class="
                  block text-sm font-medium mb-2
                  text-text-primary dark:text-dark-text-primary
                "
              >
                Invite Code
              </label>
              <input
                id="inviteCode"
                v-model="inviteCode"
                type="text"
                required
                placeholder="Enter your invite code"
                :disabled="isLoading"
                class="
                  w-full px-4 py-3
                  bg-background dark:bg-dark-background
                  border border-border dark:border-dark-border
                  rounded-ios
                  text-text-primary dark:text-dark-text-primary
                  placeholder:text-text-tertiary dark:placeholder:text-dark-text-tertiary
                  focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                  transition-all duration-300
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              />
            </div>
            <div class="flex gap-3">
              <button
                type="button"
                @click="handleBackToOptions"
                :disabled="isLoading"
                class="
                  flex-1 px-4 py-3
                  bg-surface dark:bg-dark-surface
                  text-text-primary dark:text-dark-text-primary
                  rounded-ios
                  border border-border dark:border-dark-border
                  font-medium
                  transition-all duration-300
                  hover:bg-surface/80
                  disabled:opacity-50
                "
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="isLoading || !inviteCode"
                class="
                  flex-1 px-4 py-3
                  bg-primary text-white
                  rounded-ios
                  font-medium
                  transition-all duration-300
                  hover:bg-primary-600
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              >
                {{ isLoading ? 'Joining...' : 'Join Company' }}
              </button>
            </div>
          </form>
        </div>
      </Transition>

      <!-- Create Company Form -->
      <Transition name="slide">
        <div
          v-if="showCreateForm"
          class="
            p-6
            bg-surface dark:bg-dark-surface
            rounded-ios-lg
            border border-border dark:border-dark-border
            mb-4
          "
        >
          <!-- Back Button -->
          <button
            type="button"
            @click="handleBackToOptions"
            :disabled="isLoading"
            class="
              flex items-center gap-2 mb-4
              text-text-secondary dark:text-dark-text-secondary
              hover:text-text-primary dark:hover:text-dark-text-primary
              transition-colors duration-200
              disabled:opacity-50
            "
          >
            <Icon
              name="heroicons:arrow-left"
              class="w-5 h-5"
            />
            <span class="text-sm font-medium">Back</span>
          </button>

          <h3
            class="
              text-lg font-semibold mb-4
              text-text-primary dark:text-dark-text-primary
            "
          >
            Create Your Company
          </h3>
          <p class="text-sm text-text-secondary dark:text-dark-text-secondary mb-6">
            Please provide the following information to set up your company.
          </p>
          <form @submit.prevent="handleCreateCompany" class="space-y-4">
            <!-- Company Name -->
            <div>
              <label
                for="companyName"
                class="
                  block text-sm font-medium mb-2
                  text-text-primary dark:text-dark-text-primary
                "
              >
                Company Name <span class="text-error">*</span>
              </label>
              <input
                id="companyName"
                v-model="companyForm.name"
                type="text"
                required
                placeholder="Enter your company name"
                :disabled="isLoading"
                class="
                  w-full px-4 py-3
                  bg-background dark:bg-dark-background
                  border border-border dark:border-dark-border
                  rounded-ios
                  text-text-primary dark:text-dark-text-primary
                  placeholder:text-text-tertiary dark:placeholder:text-dark-text-tertiary
                  focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                  transition-all duration-300
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              />
            </div>

            <!-- Country and Industry (Grid) -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Country -->
              <div>
                <label
                  for="country"
                  class="
                    block text-sm font-medium mb-2
                    text-text-primary dark:text-dark-text-primary
                  "
                >
                  Country <span class="text-error">*</span>
                </label>
                <select
                  id="country"
                  v-model="companyForm.country"
                  required
                  :disabled="isLoading"
                  class="
                    w-full px-4 py-3
                    bg-background dark:bg-dark-background
                    border border-border dark:border-dark-border
                    rounded-ios
                    text-text-primary dark:text-dark-text-primary
                    focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                    transition-all duration-300
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                >
                  <option value="">Select country</option>
                  <option value="MY">Malaysia</option>
                  <option value="SG">Singapore</option>
                  <option value="ID">Indonesia</option>
                  <option value="TH">Thailand</option>
                  <option value="PH">Philippines</option>
                  <option value="VN">Vietnam</option>
                  <option value="BN">Brunei</option>
                  <option value="KH">Cambodia</option>
                  <option value="MM">Myanmar</option>
                  <option value="LA">Laos</option>
                </select>
              </div>

              <!-- Industry Category -->
              <div>
                <label
                  for="industryCategory"
                  class="
                    block text-sm font-medium mb-2
                    text-text-primary dark:text-dark-text-primary
                  "
                >
                  Industry <span class="text-error">*</span>
                </label>
                <select
                  id="industryCategory"
                  v-model="companyForm.industryCategory"
                  required
                  :disabled="isLoading"
                  class="
                    w-full px-4 py-3
                    bg-background dark:bg-dark-background
                    border border-border dark:border-dark-border
                    rounded-ios
                    text-text-primary dark:text-dark-text-primary
                    focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                    transition-all duration-300
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                >
                  <option value="">Select industry</option>
                  <option value="E-commerce">E-commerce</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Education/Courses">Education/Courses</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Professional Services">Professional Services</option>
                  <option value="Restaurant/Food & Beverage">Restaurant/Food & Beverage</option>
                  <option value="Fitness/Wellness">Fitness/Wellness</option>
                  <option value="Financial Services">Financial Services</option>
                  <option value="Travel/Tourism">Travel/Tourism</option>
                  <option value="SaaS/Technology">SaaS/Technology</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>
            </div>

            <!-- Language and Currency (Grid) -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Preferred Language -->
              <div>
                <label
                  for="preferredLanguage"
                  class="
                    block text-sm font-medium mb-2
                    text-text-primary dark:text-dark-text-primary
                  "
                >
                  Preferred Language <span class="text-error">*</span>
                </label>
                <select
                  id="preferredLanguage"
                  v-model="companyForm.preferredLanguage"
                  required
                  :disabled="isLoading"
                  class="
                    w-full px-4 py-3
                    bg-background dark:bg-dark-background
                    border border-border dark:border-dark-border
                    rounded-ios
                    text-text-primary dark:text-dark-text-primary
                    focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                    transition-all duration-300
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                >
                  <option value="">Select language</option>
                  <option value="en">English</option>
                  <option value="bm">Bahasa Malaysia</option>
                  <option value="zh">Mandarin</option>
                  <option value="ta">Tamil</option>
                </select>
              </div>

              <!-- Currency -->
              <div>
                <label
                  for="currency"
                  class="
                    block text-sm font-medium mb-2
                    text-text-primary dark:text-dark-text-primary
                  "
                >
                  Currency <span class="text-error">*</span>
                </label>
                <select
                  id="currency"
                  v-model="companyForm.currency"
                  required
                  :disabled="isLoading"
                  class="
                    w-full px-4 py-3
                    bg-background dark:bg-dark-background
                    border border-border dark:border-dark-border
                    rounded-ios
                    text-text-primary dark:text-dark-text-primary
                    focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                    transition-all duration-300
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                >
                  <option value="">Select currency</option>
                  <option value="MYR">MYR - Malaysian Ringgit</option>
                  <option value="SGD">SGD - Singapore Dollar</option>
                  <option value="IDR">IDR - Indonesian Rupiah</option>
                  <option value="THB">THB - Thai Baht</option>
                  <option value="PHP">PHP - Philippine Peso</option>
                  <option value="VND">VND - Vietnamese Dong</option>
                  <option value="BND">BND - Brunei Dollar</option>
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                </select>
              </div>
            </div>

            <!-- Timezone and Date Format (Grid) -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Timezone -->
              <div>
                <label
                  for="timezone"
                  class="
                    block text-sm font-medium mb-2
                    text-text-primary dark:text-dark-text-primary
                  "
                >
                  Timezone <span class="text-error">*</span>
                </label>
                <select
                  id="timezone"
                  v-model="companyForm.timezone"
                  required
                  :disabled="isLoading"
                  class="
                    w-full px-4 py-3
                    bg-background dark:bg-dark-background
                    border border-border dark:border-dark-border
                    rounded-ios
                    text-text-primary dark:text-dark-text-primary
                    focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                    transition-all duration-300
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                >
                  <option value="">Select timezone</option>
                  <option value="Asia/Kuala_Lumpur">Asia/Kuala_Lumpur (MY, SG, BN)</option>
                  <option value="Asia/Jakarta">Asia/Jakarta (ID)</option>
                  <option value="Asia/Bangkok">Asia/Bangkok (TH)</option>
                  <option value="Asia/Manila">Asia/Manila (PH)</option>
                  <option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh (VN)</option>
                  <option value="Asia/Phnom_Penh">Asia/Phnom_Penh (KH)</option>
                  <option value="Asia/Yangon">Asia/Yangon (MM)</option>
                  <option value="Asia/Vientiane">Asia/Vientiane (LA)</option>
                </select>
              </div>

              <!-- Date Format -->
              <div>
                <label
                  for="dateFormat"
                  class="
                    block text-sm font-medium mb-2
                    text-text-primary dark:text-dark-text-primary
                  "
                >
                  Date Format <span class="text-error">*</span>
                </label>
                <select
                  id="dateFormat"
                  v-model="companyForm.dateFormat"
                  required
                  :disabled="isLoading"
                  class="
                    w-full px-4 py-3
                    bg-background dark:bg-dark-background
                    border border-border dark:border-dark-border
                    rounded-ios
                    text-text-primary dark:text-dark-text-primary
                    focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                    transition-all duration-300
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  <option value="DD MMM YYYY">DD MMM YYYY</option>
                  <option value="MMM DD, YYYY">MMM DD, YYYY</option>
                </select>
              </div>
            </div>

            <!-- Logo URL (Optional) -->
            <div>
              <label
                for="logoUrl"
                class="
                  block text-sm font-medium mb-2
                  text-text-primary dark:text-dark-text-primary
                "
              >
                Logo URL (Optional)
              </label>
              <input
                id="logoUrl"
                v-model="companyForm.logoUrl"
                type="url"
                placeholder="https://example.com/logo.png"
                :disabled="isLoading"
                class="
                  w-full px-4 py-3
                  bg-background dark:bg-dark-background
                  border border-border dark:border-dark-border
                  rounded-ios
                  text-text-primary dark:text-dark-text-primary
                  placeholder:text-text-tertiary dark:placeholder:text-dark-text-tertiary
                  focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                  transition-all duration-300
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              />
            </div>
            <div class="flex gap-3">
              <button
                type="button"
                @click="handleBackToOptions"
                :disabled="isLoading"
                class="
                  flex-1 px-4 py-3
                  bg-surface dark:bg-dark-surface
                  text-text-primary dark:text-dark-text-primary
                  rounded-ios
                  border border-border dark:border-dark-border
                  font-medium
                  transition-all duration-300
                  hover:bg-surface/80
                  disabled:opacity-50
                "
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="isLoading || !isFormValid"
                class="
                  flex-1 px-4 py-3
                  bg-primary text-white
                  rounded-ios
                  font-medium
                  transition-all duration-300
                  hover:bg-primary-600
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              >
                {{ isLoading ? 'Creating...' : 'Create Company' }}
              </button>
            </div>
          </form>
        </div>
      </Transition>

      <!-- Error Message -->
      <div
        v-if="error"
        class="
          p-4 mb-4
          bg-error-light dark:bg-error/20
          border border-error/30
          rounded-ios
          text-error
          text-sm
        "
      >
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
  middleware: 'auth',
  requiresAuth: true,
})

const { user, checkAuth } = useAuth()
const trpc = useTrpc()
const toast = useToast()

const isLoading = ref(false)
const error = ref<string | null>(null)
const showJoinForm = ref(false)
const showCreateForm = ref(false)
const inviteCode = ref('')

// Company form state
const companyForm = reactive({
  name: '',
  country: '',
  industryCategory: '',
  preferredLanguage: '',
  currency: '',
  timezone: '',
  dateFormat: 'DD/MM/YYYY',
  logoUrl: '',
})

// Form validation
const isFormValid = computed(() => {
  return !!(
    companyForm.name &&
    companyForm.country &&
    companyForm.industryCategory &&
    companyForm.preferredLanguage &&
    companyForm.currency &&
    companyForm.timezone &&
    companyForm.dateFormat
  )
})

// Check if user already has a company
onMounted(async () => {
  await checkAuth()
  if (user.value?.company_id) {
    // User already has a company, redirect to dashboard
    const role = user.value.role
    if (role === 'super_admin') {
      await navigateTo('/admin/dashboard')
    } else if (role === 'company_admin') {
      await navigateTo('/company/dashboard')
    } else if (role === 'company_user') {
      await navigateTo('/agent/dashboard')
    }
  }
})

// Handle option selection
const handleSelectJoin = () => {
  showCreateForm.value = false
  showJoinForm.value = true
  companyName.value = '' // Clear other form
  error.value = null
}

const handleSelectCreate = () => {
  // Only allow company_admin role to create companies
  if (user.value?.role !== 'company_admin') {
    toast.add({
      title: 'Permission Denied',
      description: 'Only company administrators can create new companies.',
      color: 'error',
      timeout: 5000
    })
    return
  }
  
  showJoinForm.value = false
  showCreateForm.value = true
  inviteCode.value = '' // Clear other form
  error.value = null
}

// Handle back to options
const handleBackToOptions = () => {
  showJoinForm.value = false
  showCreateForm.value = false
  inviteCode.value = ''
  // Reset company form
  companyForm.name = ''
  companyForm.country = ''
  companyForm.industryCategory = ''
  companyForm.preferredLanguage = ''
  companyForm.currency = ''
  companyForm.timezone = ''
  companyForm.dateFormat = 'DD/MM/YYYY'
  companyForm.logoUrl = ''
  error.value = null
}

const handleJoinCompany = async () => {
  // Only company_user can join via invite code
  if (user.value?.role !== 'company_user') {
    toast.add({
      title: 'Permission Denied',
      description: 'Only company users can join companies via invite code.',
      color: 'error',
      timeout: 5000
    })
    return
  }

  try {
    isLoading.value = true
    error.value = null

    // TODO: Implement join company with invite code
    // For now, show a message
    toast.add({
      title: 'Coming Soon',
      description: 'Invite code joining will be available soon.',
      color: 'info',
      timeout: 5000
    })
    
    handleBackToOptions()
  } catch (err: any) {
    error.value = err?.message || 'Failed to join company'
    console.error('Join company error:', err)
    
    toast.add({
      title: 'Error',
      description: error.value,
      color: 'error',
      timeout: 5000
    })
  } finally {
    isLoading.value = false
  }
}

const handleCreateCompany = async () => {
  // Validate form
  if (!isFormValid.value) {
    error.value = 'Please fill in all required fields'
    toast.add({
      title: 'Validation Error',
      description: 'Please fill in all required fields',
      color: 'error',
      timeout: 5000
    })
    return
  }

  // Check if user has company_admin role
  if (user.value?.role !== 'company_admin') {
    error.value = 'Only company administrators can create companies'
    toast.add({
      title: 'Permission Denied',
      description: 'Only company administrators can create new companies.',
      color: 'error',
      timeout: 5000
    })
    return
  }

  try {
    isLoading.value = true
    error.value = null

    // Create company using user-facing endpoint
    const result = await trpc.auth.createMyCompany.mutate({
      name: companyForm.name,
      country: companyForm.country as any,
      industryCategory: companyForm.industryCategory as any,
      preferredLanguage: companyForm.preferredLanguage as any,
      currency: companyForm.currency as any,
      timezone: companyForm.timezone,
      dateFormat: companyForm.dateFormat as any,
      logoUrl: companyForm.logoUrl || undefined,
    })

    toast.add({
      title: 'Company Created!',
      description: 'Your new company has been created successfully. You can manage multiple companies as a company administrator.',
      color: 'success',
      timeout: 3000
    })

    // Reset form and go back to options (admin can create more companies)
    handleBackToOptions()
  } catch (err: any) {
    error.value = err?.message || err?.data?.message || 'Failed to create company'
    console.error('Create company error:', err)
    
    toast.add({
      title: 'Error',
      description: error.value,
      color: 'error',
      timeout: 5000
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* Fade transition for options */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Slide transition for forms */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(-10px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(10px);
}
</style>

