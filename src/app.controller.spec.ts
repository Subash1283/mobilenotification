import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { SendNotificationService } from './service/notification.service';

jest.mock('./config/firebase.config', () => ({
  __esModule: true,
  default: {
    messaging: jest.fn(),
    apps: [],
  },
}));

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: SendNotificationService,
          useValue: {
            sendNotification: jest.fn(),
            sendOtp: jest.fn(),
            verifyOtp: jest.fn(),
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should be defined', () => {
      expect(appController).toBeDefined();
    });
  });
});
