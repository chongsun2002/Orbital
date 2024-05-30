import { prisma } from '../../index.js'
import { FriendRequest } from '@prisma/client'

export default class FriendsDAO {
    /**
     * This function creates a friend request.  
     * @param requesterId id of the user sending the friend request
     * @param recipientId id of the user receiving the friend request 
     * @param isSecret boolean indicating if the friend request is visible or anonymous 
     * @returns the new friend request
     */
    static async sendFriendRequest(requesterId: string, recipientId: string, isSecret: boolean): Promise<FriendRequest> {
        const friendRequest = await prisma.friendRequest.create({
            data: {
                user1: {
                    connect: {id: requesterId}
                },
                user2: {
                    connect: {id: recipientId}
                },
                isSecret: isSecret
            }
        })
        return friendRequest;
    } 

    /**
     * This function allows a user to accept a friend request. 
     * @param requesterId id of the requester 
     * @param recipientId id of the recipient 
     */
    static async acceptFriendRequest(requesterId: string, recipientId: string) {
        const friendRequest: FriendRequest | null = await prisma.friendRequest.delete({
            where: {
                user1Id_user2Id: {
                    user1Id: requesterId,
                    user2Id: recipientId
                }
            },
        });
        if (friendRequest != null) {
            await prisma.user.update({
                where: {
                    id: requesterId
                },
                data: {
                    friends: {
                        connect: { id: recipientId }
                    }
                }
            });
            await prisma.user.update({
                where: {
                    id: recipientId
                },
                data: {
                    friends: {
                        connect: { id: requesterId }
                    }
                }
            });
        }
    }

    /**
     * This function allows a user to decline a friend request. 
     * @param requesterId id of the requester 
     * @param recipientId id of the recipient 
     */
    static async declineFriendRequest(requesterId: string, recipientId: string) { 
        await prisma.friendRequest.delete({
            where: {
                user1Id_user2Id: {
                    user1Id: requesterId,
                    user2Id: recipientId
                }
            }
        });
    }

    /**
     * This function checks if two users are friends.
     * @param user1Id id of the first user
     * @param user2Id id of the second user 
     * @returns true if the two users are friends, false otherwise 
     */
    static async isFriends(user1Id: string, user2Id: string): Promise<boolean> {
        const f = await prisma.user.findUnique({
            where: {
                id: user1Id
            },
            select: {
                _count: {
                    select: {
                        friends: {
                            where: { id: user2Id }
                        }
                    }
                }
            }
        });
        return (f?._count.friends || 0) > 0; 
    }

    /**
     * This function gets all friends of the specified user 
     * @param userId The id of the user
     * @returns A list of ids of users which are friends of the specified user
     */
    static async getFriends(userId: string) {
        const friends = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                friends: {
                    select: { 
                        id: true,
                        name: true,
                        image: true
                    }
                }
            }
        });
        return friends;
    }

    /**
     * This function gets all the outgoing friend requests of a specified user which are still pending. 
     * @param userId the id of the specified user
     * @returns a list of ids of users who have a pending friend request from our specified user
     */
    static async getPendingOutgoing(userId: string) {
        const outgoing = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                requestedFriendships: {
                    select: {
                        user2id: true
                    }
                } 
            }
        });
        return outgoing;
    }

    /**
     * This function gets all the incoming friend requests of a specified user which are still pending, and are visible to the user.
     * @param userId the id of the specified user
     * @returns a list of ids of users who have a pending friend request from our specified user
     */
    static async getPendingIncoming(userId: string) {
        const incoming = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                receivedFriendships: {
                    where: {
                        isSecret: false
                    },
                    select: {
                        user1Id: true
                    }
                } 
            }
        });
        return incoming;
    }

    static async removeFriend(userId: string, friendId: string) {
        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                friends: {
                    disconnect: { id: friendId }
                }
            }
        });
        await prisma.user.update({
            where: {
                id: friendId
            },
            data: {
                friends: {
                    disconnect: { id: userId }
                }
            }
        });
    }
}