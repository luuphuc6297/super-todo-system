import { CategoryModel } from '@modules/category/models/category.model'
import { PaymentModel, PaymentStatus } from '@modules/payment/models/payment.model'
import { SubscriptionPlanModel } from '@modules/subscription/models/subscription-plan.model'
import {
  SubscriptionModel,
  SubscriptionStatus,
} from '@modules/subscription/models/subscription.model'
import { TagModel } from '@modules/tag/models/tag.model'
import { TaskTagModel } from '@modules/task/models/task-tag.model'
import { TaskModel, TaskPriority, TaskStatus } from '@modules/task/models/task.model'
import { UserModel, UserRole, UserStatus } from '@modules/user/models/user.model'
import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import * as bcryptjs from 'bcryptjs'

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name)

  constructor(
    @InjectModel(UserModel)
    private readonly userRepository: typeof UserModel,
    @InjectModel(CategoryModel)
    private readonly categoryRepository: typeof CategoryModel,
    @InjectModel(TaskModel)
    private readonly taskRepository: typeof TaskModel,
    @InjectModel(TagModel)
    private readonly tagRepository: typeof TagModel,
    @InjectModel(TaskTagModel)
    private readonly taskTagRepository: typeof TaskTagModel,
    @InjectModel(SubscriptionModel)
    private readonly subscriptionRepository: typeof SubscriptionModel,
    @InjectModel(SubscriptionPlanModel)
    private readonly subscriptionPlanRepository: typeof SubscriptionPlanModel,
    @InjectModel(PaymentModel)
    private readonly paymentRepository: typeof PaymentModel
  ) {}

  async seed() {
    try {
      this.logger.log('Cleaning database...')
      await this.cleanDatabase()

      this.logger.log('Seeding users...')
      const users = await this.seedUsers()
      this.logger.log(`Created ${users.length} users`)

      this.logger.log('Seeding categories...')
      const categories = await this.seedCategories()
      this.logger.log(`Created ${categories.length} categories`)

      this.logger.log('Seeding tags...')
      const tags = await this.seedTags()
      this.logger.log(`Created ${tags.length} tags`)

      this.logger.log('Seeding subscription plans...')
      const plans = await this.seedSubscriptionPlans()
      this.logger.log(`Created ${plans.length} subscription plans`)

      this.logger.log('Seeding subscriptions...')
      const subscriptions = await this.seedSubscriptions(users, plans)
      this.logger.log(`Created ${subscriptions.length} subscriptions`)

      this.logger.log('Seeding payments...')
      const payments = await this.seedPayments(users, subscriptions)
      this.logger.log(`Created ${payments.length} payments`)

      this.logger.log('Seeding tasks...')
      const tasks = await this.seedTasks(users, categories)
      this.logger.log(`Created ${tasks.length} tasks`)

      this.logger.log('Seeding task tags...')
      const taskTags = await this.seedTaskTags(tasks, tags)
      this.logger.log(`Created ${taskTags.length} task tags`)

      this.logger.log('Seeding completed successfully')
    } catch (error) {
      this.logger.error(`Seeding failed: ${error.message}`)
      throw error
    }
  }

  private async cleanDatabase() {
    await this.taskTagRepository.destroy({ where: {}, force: true })
    await this.taskRepository.destroy({ where: {}, force: true })
    await this.tagRepository.destroy({ where: {}, force: true })
    await this.categoryRepository.destroy({ where: {}, force: true })
    await this.paymentRepository.destroy({ where: {}, force: true })
    await this.subscriptionRepository.destroy({ where: {}, force: true })
    await this.subscriptionPlanRepository.destroy({ where: {}, force: true })
    await this.userRepository.destroy({ where: {}, force: true })
  }

  private async seedUsers(): Promise<UserModel[]> {
    const users = [
      {
        username: 'admin',
        email: 'admin@example.com',
        password: await bcryptjs.hash('password', 10),
        fullName: 'Admin User',
        role: UserRole.ADMIN,
        status: UserStatus.ACTIVE,
        lastLoginAt: new Date(),
        isEmailVerified: true,
      },
      {
        username: 'paid_user',
        email: 'paid@example.com',
        password: await bcryptjs.hash('password', 10),
        fullName: 'Paid User',
        role: UserRole.PAID,
        status: UserStatus.ACTIVE,
        lastLoginAt: new Date(),
        isEmailVerified: true,
      },
      {
        username: 'free_user',
        email: 'free@example.com',
        password: await bcryptjs.hash('password', 10),
        fullName: 'Free User',
        role: UserRole.FREE,
        status: UserStatus.ACTIVE,
        lastLoginAt: new Date(),
        isEmailVerified: true,
      },
    ]

    return await this.userRepository.bulkCreate(users)
  }

  private async seedCategories(): Promise<CategoryModel[]> {
    const categories = [
      {
        name: 'Work',
        description: 'Work-related tasks',
        color: '#FF5733',
      },
      {
        name: 'Personal',
        description: 'Personal tasks',
        color: '#33FF57',
      },
      {
        name: 'Study',
        description: 'Study-related tasks',
        color: '#3357FF',
      },
    ]

    return await this.categoryRepository.bulkCreate(categories)
  }

  private async seedTags(): Promise<TagModel[]> {
    const tags = [
      {
        name: 'Urgent',
        color: '#FF0000',
      },
      {
        name: 'Important',
        color: '#FFA500',
      },
      {
        name: 'Low Priority',
        color: '#00FF00',
      },
      {
        name: 'Meeting',
        color: '#0000FF',
      },
      {
        name: 'Project',
        color: '#800080',
      },
    ]

    return await this.tagRepository.bulkCreate(tags)
  }

  private async seedSubscriptionPlans(): Promise<SubscriptionPlanModel[]> {
    const plans = [
      {
        name: 'Free Plan',
        description: 'Basic features for free users',
        price: 0,
        duration: 0, // Unlimited for free plan
        features: {
          taskLimit: 10,
          categoryLimit: 3,
          tagLimit: 5,
          canSetDueDate: true,
          canSetPriority: true,
          canAddNotes: false,
        },
      },
      {
        name: 'Premium Monthly',
        description: 'Premium features with monthly billing',
        price: 9.99,
        duration: 1, // 1 month
        features: {
          taskLimit: 100,
          categoryLimit: 10,
          tagLimit: 20,
          canSetDueDate: true,
          canSetPriority: true,
          canAddNotes: true,
        },
      },
      {
        name: 'Premium Yearly',
        description: 'Premium features with yearly billing (save 20%)',
        price: 95.88,
        duration: 12, // 12 months
        features: {
          taskLimit: 100,
          categoryLimit: 10,
          tagLimit: 20,
          canSetDueDate: true,
          canSetPriority: true,
          canAddNotes: true,
        },
      },
    ]

    return await this.subscriptionPlanRepository.bulkCreate(plans)
  }

  private async seedSubscriptions(
    users: UserModel[],
    plans: SubscriptionPlanModel[]
  ): Promise<SubscriptionModel[]> {
    const freePlan = plans.find((plan) => plan.name === 'Free Plan')
    const monthlyPlan = plans.find((plan) => plan.name === 'Premium Monthly')
    const yearlyPlan = plans.find((plan) => plan.name === 'Premium Yearly')

    const freeUser = users.find((user) => user.role === UserRole.FREE)
    const paidUser = users.find((user) => user.role === UserRole.PAID)
    const adminUser = users.find((user) => user.role === UserRole.ADMIN)

    const now = new Date()
    const oneMonthLater = new Date(now)
    oneMonthLater.setMonth(oneMonthLater.getMonth() + 1)

    const oneYearLater = new Date(now)
    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1)

    const subscriptions = [
      {
        userId: freeUser.id,
        planId: freePlan.id,
        startDate: now,
        endDate: null, // Free plan doesn't expire
        status: SubscriptionStatus.ACTIVE,
      },
      {
        userId: paidUser.id,
        planId: monthlyPlan.id,
        startDate: now,
        endDate: oneMonthLater,
        status: SubscriptionStatus.ACTIVE,
      },
      {
        userId: adminUser.id,
        planId: yearlyPlan.id,
        startDate: now,
        endDate: oneYearLater,
        status: SubscriptionStatus.ACTIVE,
      },
    ]

    return await this.subscriptionRepository.bulkCreate(subscriptions)
  }

  private async seedPayments(
    users: UserModel[],
    subscriptions: SubscriptionModel[]
  ): Promise<PaymentModel[]> {
    const paidUser = users.find((user) => user.role === UserRole.PAID)
    const adminUser = users.find((user) => user.role === UserRole.ADMIN)

    const paidUserSubscription = subscriptions.find((sub) => sub.userId === paidUser.id)
    const adminUserSubscription = subscriptions.find((sub) => sub.userId === adminUser.id)

    const payments = [
      {
        userId: paidUser.id,
        subscriptionId: paidUserSubscription.id,
        amount: 9.99,
        paymentDate: new Date(),
        paymentMethod: 'credit_card',
        status: PaymentStatus.COMPLETED,
        transactionId: 'txn_' + Math.random().toString(36).substring(2, 15),
      },
      {
        userId: adminUser.id,
        subscriptionId: adminUserSubscription.id,
        amount: 95.88,
        paymentDate: new Date(),
        paymentMethod: 'paypal',
        status: PaymentStatus.COMPLETED,
        transactionId: 'txn_' + Math.random().toString(36).substring(2, 15),
      },
    ]

    return await this.paymentRepository.bulkCreate(payments)
  }

  private async seedTasks(users: UserModel[], categories: CategoryModel[]): Promise<TaskModel[]> {
    const freeUser = users.find((user) => user.role === UserRole.FREE)
    const paidUser = users.find((user) => user.role === UserRole.PAID)
    const adminUser = users.find((user) => user.role === UserRole.ADMIN)

    const workCategory = categories.find((category) => category.name === 'Work')
    const personalCategory = categories.find((category) => category.name === 'Personal')
    const studyCategory = categories.find((category) => category.name === 'Study')

    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const nextWeek = new Date(now)
    nextWeek.setDate(nextWeek.getDate() + 7)

    const tasks = [
      {
        title: 'Complete project proposal',
        description: 'Write and submit the project proposal for the new client',
        creatorId: adminUser.id,
        assigneeId: adminUser.id,
        categoryId: workCategory.id,
        priority: TaskPriority.HIGH,
        estimateTime: 120, // 2 hours
        status: TaskStatus.IN_PROGRESS,
        notes: 'Include budget estimates and timeline',
        dueDate: tomorrow,
      },
      {
        title: 'Grocery shopping',
        description: 'Buy groceries for the week',
        creatorId: paidUser.id,
        assigneeId: paidUser.id,
        categoryId: personalCategory.id,
        priority: TaskPriority.MEDIUM,
        estimateTime: 60, // 1 hour
        status: TaskStatus.TODO,
        notes: "Don't forget milk and eggs",
        dueDate: tomorrow,
      },
      {
        title: 'Study for exam',
        description: 'Review chapters 5-8 for the upcoming exam',
        creatorId: freeUser.id,
        assigneeId: freeUser.id,
        categoryId: studyCategory.id,
        priority: TaskPriority.HIGH,
        estimateTime: 180, // 3 hours
        status: TaskStatus.TODO,
        notes: null, // Free user can't add notes
        dueDate: nextWeek,
      },
    ]

    return await this.taskRepository.bulkCreate(tasks)
  }

  private async seedTaskTags(tasks: TaskModel[], tags: TagModel[]): Promise<TaskTagModel[]> {
    const projectProposalTask = tasks.find((task) => task.title === 'Complete project proposal')
    const groceryTask = tasks.find((task) => task.title === 'Grocery shopping')
    const studyTask = tasks.find((task) => task.title === 'Study for exam')

    const urgentTag = tags.find((tag) => tag.name === 'Urgent')
    const importantTag = tags.find((tag) => tag.name === 'Important')
    const projectTag = tags.find((tag) => tag.name === 'Project')
    const lowPriorityTag = tags.find((tag) => tag.name === 'Low Priority')

    const taskTags = [
      {
        taskId: projectProposalTask.id,
        tagId: urgentTag.id,
      },
      {
        taskId: projectProposalTask.id,
        tagId: projectTag.id,
      },
      {
        taskId: groceryTask.id,
        tagId: lowPriorityTag.id,
      },
      {
        taskId: studyTask.id,
        tagId: importantTag.id,
      },
      {
        taskId: studyTask.id,
        tagId: urgentTag.id,
      },
    ]

    return await this.taskTagRepository.bulkCreate(taskTags)
  }
}
