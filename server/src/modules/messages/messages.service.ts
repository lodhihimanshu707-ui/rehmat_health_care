import { Op } from "sequelize";
import { BaseService } from "../../core/base/base.service.js";
import { Message } from "../../models/Message.js";
import { User } from "../../models/User.js";

export class MessagesService extends BaseService {
  async getThread(user1Id: string, user2Id: string) {
    return Message.findAll({
      where: {
        [Op.or]: [
          { senderId: user1Id, receiverId: user2Id },
          { senderId: user2Id, receiverId: user1Id },
        ],
      },
      include: [
        { model: User, as: "sender", attributes: ["id", "name", "avatarUrl"] },
        { model: User, as: "receiver", attributes: ["id", "name", "avatarUrl"] },
      ],
      order: [["createdAt", "ASC"]],
      limit: 100,
    });
  }

  async sendMessage(senderId: string, receiverId: string, text: string, consultationId?: string) {
    const message = await Message.create({
      senderId,
      receiverId,
      text,
      consultationId,
      isRead: false,
    });

    return Message.findByPk(message.id, {
      include: [
        { model: User, as: "sender", attributes: ["id", "name", "avatarUrl"] },
        { model: User, as: "receiver", attributes: ["id", "name", "avatarUrl"] },
      ],
    });
  }

  async markAsRead(senderId: string, receiverId: string) {
    return Message.update(
      { isRead: true },
      {
        where: {
          senderId,
          receiverId,
          isRead: false,
        },
      }
    );
  }
}

export const messagesService = new MessagesService();
