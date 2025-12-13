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
          You need to join or create a company to continue
        </p>
      </div>

      <!-- Options -->
      <div class="flex flex-col gap-4 mb-6">
        <!-- Join Company Option -->
        <button
          @click="showJoinForm = true"
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

        <!-- Create Company Option -->
        <button
          @click="showCreateForm = true"
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
                Start your own company and invite team members
              </p>
            </div>
          </div>
          <Icon
            name="heroicons:chevron-right"
            class="w-5 h-5 text-text-secondary dark:text-dark-text-secondary"
          />
        </button>
      </div>

      <!-- Join Company Form -->
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
              class="
                w-full px-4 py-3
                bg-background dark:bg-dark-background
                border border-border dark:border-dark-border
                rounded-ios
                text-text-primary dark:text-dark-text-primary
                placeholder:text-text-tertiary dark:placeholder:text-dark-text-tertiary
                focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                transition-all duration-300
              "
            />
          </div>
          <div class="flex gap-3">
            <button
              type="button"
              @click="showJoinForm = false"
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

      <!-- Create Company Form -->
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
        <h3
          class="
            text-lg font-semibold mb-4
            text-text-primary dark:text-dark-text-primary
          "
        >
          Create Your Company
        </h3>
        <form @submit.prevent="handleCreateCompany" class="space-y-4">
          <div>
            <label
              for="companyName"
              class="
                block text-sm font-medium mb-2
                text-text-primary dark:text-dark-text-primary
              "
            >
              Company Name
            </label>
            <input
              id="companyName"
              v-model="companyName"
              type="text"
              required
              placeholder="Enter your company name"
              class="
                w-full px-4 py-3
                bg-background dark:bg-dark-background
                border border-border dark:border-dark-border
                rounded-ios
                text-text-primary dark:text-dark-text-primary
                placeholder:text-text-tertiary dark:placeholder:text-dark-text-tertiary
                focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                transition-all duration-300
              "
            />
          </div>
          <div class="flex gap-3">
            <button
              type="button"
              @click="showCreateForm = false"
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
              :disabled="isLoading || !companyName"
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
const companyName = ref('')

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

const handleJoinCompany = async () => {
  try {
    isLoading.value = true
    error.value = null

    // TODO: Implement join company with invite code
    // For now, show a message
    toast.add({
      title: 'Coming Soon',
      description: 'Invite code joining will be available soon. Please create a company instead.',
      color: 'info',
      timeout: 5000
    })
    
    showJoinForm.value = false
  } catch (err: any) {
    error.value = err?.message || 'Failed to join company'
    console.error('Join company error:', err)
  } finally {
    isLoading.value = false
  }
}

const handleCreateCompany = async () => {
  try {
    isLoading.value = true
    error.value = null

    // TODO: Create a user-facing company creation endpoint
    // For now, show a message that this feature needs backend support
    toast.add({
      title: 'Feature Coming Soon',
      description: 'Company creation for new users is being set up. Please contact support or ask an admin to create a company for you.',
      color: 'info',
      timeout: 5000
    })
    
    // Temporary: Try to create company (will fail if not super admin, but shows proper error)
    try {
      const company = await trpc.companies.create.mutate({
        name: companyName.value,
      })

      // If successful, refresh user data
      await checkAuth()

      toast.add({
        title: 'Company Created!',
        description: 'Your company has been created successfully.',
        color: 'success',
        timeout: 3000
      })

      // Redirect to appropriate dashboard
      const role = user.value?.role
      if (role === 'company_admin') {
        await navigateTo('/company/dashboard')
      } else if (role === 'company_user') {
        await navigateTo('/agent/dashboard')
      } else {
        await navigateTo('/')
      }
    } catch (createError: any) {
      // If creation fails due to permissions, show helpful message
      if (createError?.data?.code === 'FORBIDDEN' || createError?.message?.includes('permission')) {
        error.value = 'You need admin privileges to create a company. Please contact support or ask an admin to create a company for you.'
      } else {
        throw createError
      }
    }
  } catch (err: any) {
    error.value = err?.message || 'Failed to create company'
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

