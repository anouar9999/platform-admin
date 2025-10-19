// utils/adminNotifications.js
// Admin notification system for sending notifications to users
import axios from "axios";

/**
 * Send notification to a user from admin panel
 * @param {number} userId - The user ID to send notification to
 * @param {string} message - The notification message (plain text, no emojis)
 * @param {number} adminId - The admin ID sending the notification
 * @param {string} senderName - Name to display as sender (default: 'Admin')
 * @returns {Promise<boolean>} - Returns true if successful, false otherwise
 */
export const sendAdminNotification = async (userId, message, adminId, senderName = 'Admin') => {
  try {
    // Validate required parameters
    if (!userId || !message || !adminId) {
      console.error('Missing required parameters:', { userId, message, adminId });
      return false;
    }

    console.log('Admin sending notification:', { 
      userId, 
      adminId, 
      senderName,
      messageLength: message.length 
    });

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/notifications.php?action=create`,
      {
        target_user_id: parseInt(userId),
        user_id: parseInt(adminId),
        message: message.trim(),
        sender_name: senderName
      },
      {
        headers: { 
          'Content-Type': 'application/json' 
        },
        timeout: 10000 // 10 second timeout
      }
    );
    
    if (response.data.success) {
      console.log('Notification sent successfully. ID:', response.data.notification_id);
      return true;
    } else {
      console.error('Failed to send notification:', response.data.error);
      return false;
    }
  } catch (error) {
    console.error('Error sending notification:', error.message);
    if (error.response) {
      console.error('Server response:', error.response.data);
      console.error('Status code:', error.response.status);
    } else if (error.request) {
      console.error('No response received from server');
    }
    return false;
  }
};

/**
 * Send acceptance notification to user/team
 * @param {object} profile - User or team profile object
 * @param {number} adminId - Admin ID sending the notification
 * @param {string} tournamentName - Name of the tournament
 * @returns {Promise<boolean>} - Returns true if successful
 */
export const sendAcceptanceNotification = async (profile, adminId, tournamentName) => {
  try {
    const isTeam = Boolean(profile.team_id);
    const userName = isTeam ? profile.team_name : profile.name;
    const userId = isTeam ? profile.owner_id : profile.user_id;
    
    if (!userId) {
      console.error('Cannot send notification: user ID not found in profile');
      return false;
    }
    
    const message = isTeam
      ? `Congratulations! Your team "${userName}" has been accepted for "${tournamentName}". Get ready to compete!`
      : `Congratulations ${userName}! Your registration for "${tournamentName}" has been accepted. Good luck!`;
    
    return await sendAdminNotification(userId, message, adminId, 'Tournament Admin');
  } catch (error) {
    console.error('Error in sendAcceptanceNotification:', error);
    return false;
  }
};

/**
 * Send rejection notification to user/team
 * @param {object} profile - User or team profile object
 * @param {number} adminId - Admin ID sending the notification
 * @param {string} tournamentName - Name of the tournament
 * @returns {Promise<boolean>} - Returns true if successful
 */
export const sendRejectionNotification = async (profile, adminId, tournamentName) => {
  try {
    const isTeam = Boolean(profile.team_id);
    const userName = isTeam ? profile.team_name : profile.name;
    const userId = isTeam ? profile.owner_id : profile.user_id;
    
    if (!userId) {
      console.error('Cannot send notification: user ID not found in profile');
      return false;
    }
    
    const message = isTeam
      ? `Unfortunately, your team "${userName}" has not been accepted for "${tournamentName}". Thank you for your interest.`
      : `We regret to inform you that your registration for "${tournamentName}" was not accepted. Feel free to apply for future tournaments.`;
    
    return await sendAdminNotification(userId, message, adminId, 'Tournament Admin');
  } catch (error) {
    console.error('Error in sendRejectionNotification:', error);
    return false;
  }
};

/**
 * Send custom notification to a user
 * @param {number} userId - User ID to send notification to
 * @param {string} message - Custom message text
 * @param {number} adminId - Admin ID sending the notification
 * @param {string} senderName - Optional sender name (default: 'Admin')
 * @returns {Promise<boolean>} - Returns true if successful
 */
export const sendCustomNotification = async (userId, message, adminId, senderName = 'Admin') => {
  return await sendAdminNotification(userId, message, adminId, senderName);
};

/**
 * Send bulk notifications to multiple users
 * @param {Array<number>} userIds - Array of user IDs
 * @param {string} message - Message to send to all users
 * @param {number} adminId - Admin ID sending the notifications
 * @param {string} senderName - Optional sender name (default: 'Admin')
 * @returns {Promise<object>} - Returns {successful: number, failed: number}
 */
export const sendBulkNotifications = async (userIds, message, adminId, senderName = 'Admin') => {
  const results = {
    successful: 0,
    failed: 0,
    errors: []
  };

  console.log(`Sending bulk notifications to ${userIds.length} users...`);

  for (const userId of userIds) {
    try {
      const success = await sendAdminNotification(userId, message, adminId, senderName);
      if (success) {
        results.successful++;
      } else {
        results.failed++;
        results.errors.push({ userId, error: 'Failed to send' });
      }
      
      // Small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      results.failed++;
      results.errors.push({ userId, error: error.message });
    }
  }

  console.log('Bulk notification results:', {
    successful: results.successful,
    failed: results.failed
  });

  return results;
};

/**
 * Send tournament update notification to all participants
 * @param {number} tournamentId - Tournament ID
 * @param {string} message - Update message
 * @param {number} adminId - Admin ID sending the notification
 * @returns {Promise<object>} - Returns bulk send results
 */
export const sendTournamentUpdateNotification = async (tournamentId, message, adminId) => {
  try {
    // Fetch all participants for this tournament
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/participants_registration.php?tournament_id=${tournamentId}`
    );

    if (!response.data.success || !response.data.profiles) {
      console.error('Failed to fetch tournament participants');
      return { successful: 0, failed: 0, errors: ['Failed to fetch participants'] };
    }

    const profiles = response.data.profiles;
    
    // Extract user IDs (handle both individual and team registrations)
    const userIds = profiles
      .filter(p => p.status === 'accepted') // Only send to accepted participants
      .map(p => p.team_id ? p.owner_id : p.user_id)
      .filter(id => id); // Remove any null/undefined values

    if (userIds.length === 0) {
      console.log('No accepted participants found for tournament');
      return { successful: 0, failed: 0, errors: ['No participants to notify'] };
    }

    return await sendBulkNotifications(userIds, message, adminId, 'Tournament Admin');
  } catch (error) {
    console.error('Error sending tournament update notification:', error);
    return { successful: 0, failed: 0, errors: [error.message] };
  }
};

// Export all functions as default object
export default {
  sendAdminNotification,
  sendAcceptanceNotification,
  sendRejectionNotification,
  sendCustomNotification,
  sendBulkNotifications,
  sendTournamentUpdateNotification
};