<template>
    <div class="space-y-4 md:space-y-6 p-4 md:p-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <h1 class="text-2xl md:text-3xl font-semibold text-text-primary dark:text-dark-text-primary">Dashboard</h1>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div 
          v-for="(stat, index) in stats" 
          :key="index"
          class="bg-card dark:bg-dark-card rounded-ios-lg shadow-ios hover:shadow-ios-lg p-4 md:p-6 border border-border dark:border-dark-border transition-all duration-300"
        >
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="p-3 rounded-full" :class="stat.iconBg">
                <Icon :name="stat.icon" class="h-6 w-6 text-white" />
              </div>
            </div>
            <div class="ml-4 md:ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-text-secondary dark:text-dark-text-secondary truncate">{{ stat.title }}</dt>
                <dd class="flex items-baseline">
                  <div class="text-xl md:text-2xl font-semibold text-text-primary dark:text-dark-text-primary">{{ stat.value }}</div>
                  <div class="ml-2 flex items-baseline text-sm font-semibold" :class="stat.trendColor">
                    <Icon :name="stat.trendIcon" class="h-4 w-4" />
                    <span class="sr-only">{{ stat.trendText }}</span>
                    {{ stat.trendValue }}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="bg-card dark:bg-dark-card rounded-ios-lg shadow-ios border border-border dark:border-dark-border overflow-hidden">
        <div class="px-4 md:px-6 py-4 md:py-5 border-b border-border dark:border-dark-border">
          <h3 class="text-lg leading-6 font-medium text-text-primary dark:text-dark-text-primary">Recent Activity</h3>
        </div>
        <div class="divide-y divide-border dark:divide-dark-border">
          <div 
            v-for="activity in recentActivities" 
            :key="activity.id" 
            class="px-4 md:px-6 py-4 hover:bg-surface dark:hover:bg-dark-surface transition-colors duration-300"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="p-2 rounded-full" :class="activity.iconBg">
                    <Icon :name="activity.icon" class="h-5 w-5 text-white" />
                  </div>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-text-primary dark:text-dark-text-primary">{{ activity.title }}</p>
                  <p class="text-sm text-text-secondary dark:text-dark-text-secondary">{{ activity.description }}</p>
                </div>
              </div>
              <div class="text-sm text-text-secondary dark:text-dark-text-secondary">
                {{ activity.time }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
const stats = [
  {
    title: 'Total Users',
    value: '2,345',
    icon: 'heroicons:users',
    iconBg: 'bg-primary-500 dark:bg-primary-600',
    trendIcon: 'heroicons:arrow-trending-up',
    trendValue: '12%',
    trendColor: 'text-success dark:text-success-light',
    trendText: 'Increased by'
  },
  {
    title: 'Total Orders',
    value: '1,234',
    icon: 'heroicons:shopping-cart',
    iconBg: 'bg-success dark:bg-success-light',
    trendIcon: 'heroicons:arrow-trending-up',
    trendValue: '8%',
    trendColor: 'text-success dark:text-success-light',
    trendText: 'Increased by'
  },
  {
    title: 'Revenue',
    value: '$45,231',
    icon: 'heroicons:currency-dollar',
    iconBg: 'bg-info dark:bg-info-light',
    trendIcon: 'heroicons:arrow-trending-up',
    trendValue: '4%',
    trendColor: 'text-success dark:text-success-light',
    trendText: 'Increased by'
  },
  {
    title: 'Conversion Rate',
    value: '3.2%',
    icon: 'heroicons:chart-bar',
    iconBg: 'bg-warning dark:bg-warning-light',
    trendIcon: 'heroicons:arrow-trending-down',
    trendValue: '1.2%',
    trendColor: 'text-error dark:text-error-light',
    trendText: 'Decreased by'
  }
]

const recentActivities = [
  {
    id: 1,
    title: 'New user registered',
    description: 'John Doe created an account',
    icon: 'heroicons:user-plus',
    iconBg: 'bg-primary-500 dark:bg-primary-600',
    time: '2 minutes ago'
  },
  {
    id: 2,
    title: 'Order completed',
    description: 'Order #1234 was completed',
    icon: 'heroicons:check-circle',
    iconBg: 'bg-success dark:bg-success-light',
    time: '15 minutes ago'
  },
  {
    id: 3,
    title: 'Payment received',
    description: 'Payment of $99.99 received',
    icon: 'heroicons:currency-dollar',
    iconBg: 'bg-info dark:bg-info-light',
    time: '1 hour ago'
  },
  {
    id: 4,
    title: 'New product added',
    description: 'Product "Premium Plan" was added',
    icon: 'heroicons:plus-circle',
    iconBg: 'bg-warning dark:bg-warning-light',
    time: '2 hours ago'
  }
]
</script> 