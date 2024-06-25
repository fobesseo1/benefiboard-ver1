'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { BiReply, BiTrash } from 'react-icons/bi';
import { MessageType } from './InfiniteScrollMessages';
import { deleteMessage, markMessageAsRead } from '../_action/message';
import { useRouter } from 'next/navigation';

interface MessageDetailDialogProps {
  message: MessageType;
  onClose: () => void;
  onDelete: (id: string) => void;
}

const formatKoreanDate = (dateString: string): string => {
  return dateString.replace('T', ' ').substring(0, 19);
};

const MessageDetailDialog: React.FC<MessageDetailDialogProps> = ({
  message,
  onClose,
  onDelete,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!message.read) {
      markMessageAsRead(message.id);
    }
  }, [message.id, message.read]);

  const handleDelete = async () => {
    await deleteMessage(message.id);
    onDelete(message.id);
    onClose();
  };

  const handleReply = () => {
    router.push(`/message/create?receiver_id=${message.sender_id}`);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <div onClick={() => setDialogOpen(true)} className="cursor-pointer flex-1 py-4">
          <p className="font-semibold line-clamp-1">{message.title}</p>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{message.title}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <img
              src={message.userdata.avatar_url || '/default-avatar.png'}
              alt="avatar"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-bold">{message.userdata.username}</p>
              <p className="text-sm text-gray-600">{formatKoreanDate(message.created_at)}</p>
            </div>
          </div>
          <DialogDescription>{message.content}</DialogDescription>
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <Button variant="outline" onClick={handleReply}>
            <BiReply className="mr-1" /> 답장
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <BiTrash className="mr-1" /> 삭제
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MessageDetailDialog;
