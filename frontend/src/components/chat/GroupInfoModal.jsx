import { useState, useEffect } from "react";
import { X, Search, UserPlus, Trash2, LogOut, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getGroupDetailsAPI, addGroupMemberAPI, removeGroupMemberAPI } from "../../api/chatApi/chatsApi";
import { searchUsersAPI } from "../../api/userApi";
import { toast } from 'react-toastify'

export function GroupInfoModal({ isOpen, onClose, groupId, currentUserId }) {
    const [groupDetails, setGroupDetails] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    // Fetch Details on Open
    useEffect(() => {
        if (isOpen && groupId) {
            fetchDetails();
        }
    }, [isOpen, groupId]);

    const fetchDetails = async () => {
        const res = await getGroupDetailsAPI(groupId);
        if (res.success) setGroupDetails(res.data);
    };

    // Search Users to Add
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchQuery.trim().length > 1) {
                const response = await searchUsersAPI(searchQuery);
                if (response.success) setSearchResults(response.data);
            } else {
                setSearchResults([]);
            }
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    const handleAddMember = async (user) => {
        const res = await addGroupMemberAPI({ groupId, userId: user.id });
        if (res.success) {
            fetchDetails(); // Refresh list
            setSearchQuery("");
            setIsAdding(false);
        } else {
            toast.error(res.message);
        }
    };

    const handleRemoveMember = async (userId) => {
        if (!confirm("Remove this user?")) return;
        const res = await removeGroupMemberAPI({ groupId, userId });
        if (res.success) fetchDetails();
    };

    const handleLeaveGroup = async () => {
        if (!confirm("Are you sure you want to leave?")) return;
        const res = await removeGroupMemberAPI({ groupId, userId: currentUserId });
        if (res.success) {
            window.location.reload(); // Simple reload to go back to chat list
        }
    };

    if (!isOpen) return null;

    const isAdmin = groupDetails?.admins?.includes(currentUserId);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-card w-full max-w-md rounded-xl shadow-2xl overflow-hidden border border-border flex flex-col max-h-[85vh]"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
                        <h2 className="font-semibold text-lg">Group Info</h2>
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X className="w-5 h-5" />
                        </Button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-6">
                        {/* Group Profile */}
                        <div className="flex flex-col items-center">
                            <Avatar className="w-20 h-20 mb-3 border-4 border-background shadow-sm">
                                <AvatarImage src={groupDetails?.group_image} />
                                <AvatarFallback className="text-2xl">{groupDetails?.name?.[0]}</AvatarFallback>
                            </Avatar>
                            <h3 className="text-xl font-bold">{groupDetails?.name}</h3>
                            <p className="text-sm text-muted-foreground">{groupDetails?.members?.length} members</p>
                        </div>

                        {/* Add Member Section */}
                        {isAdding ? (
                            <div className="space-y-3 bg-accent/20 p-3 rounded-lg border border-border">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-medium">Add Participants</h4>
                                    <Button variant="ghost" size="sm" onClick={() => setIsAdding(false)} className="h-6 text-xs">Cancel</Button>
                                </div>
                                <Input
                                    placeholder="Search users..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    autoFocus
                                />
                                <div className="max-h-40 overflow-y-auto space-y-1">
                                    {searchResults.map(user => (
                                        <div key={user.id} onClick={() => handleAddMember(user)} className="flex items-center gap-2 p-2 hover:bg-accent rounded-md cursor-pointer">
                                            <Avatar className="w-8 h-8">
                                                <AvatarImage src={user.profile_image} />
                                                <AvatarFallback>{user.full_name[0]}</AvatarFallback>
                                            </Avatar>
                                            <p className="text-sm">{user.full_name}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <Button className="w-full" variant="outline" onClick={() => setIsAdding(true)}>
                                <UserPlus className="w-4 h-4 mr-2" /> Add Participants
                            </Button>
                        )}

                        {/* Members List */}
                        <div className="space-y-1">
                            <h4 className="text-sm font-semibold text-muted-foreground mb-2 px-1">Participants</h4>
                            {groupDetails?.members?.map(member => (
                                <div key={member.id} className="flex items-center justify-between p-2 hover:bg-accent/50 rounded-lg group">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="w-10 h-10">
                                            <AvatarImage src={member.profile_image} />
                                            <AvatarFallback>{member.full_name[0]}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium text-sm flex items-center gap-1">
                                                {member.id === currentUserId ? "You" : member.full_name}
                                                {groupDetails.admins.includes(member.id) && <Shield className="w-3 h-3 text-green-500 fill-green-500/20" />}
                                            </p>
                                            <p className="text-xs text-muted-foreground">@{member.username}</p>
                                        </div>
                                    </div>

                                    {/* Admin Actions */}
                                    {isAdmin && member.id !== currentUserId && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => handleRemoveMember(member.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-4 border-t border-border bg-muted/20">
                        <Button variant="destructive" className="w-full" onClick={handleLeaveGroup}>
                            <LogOut className="w-4 h-4 mr-2" /> Exit Group
                        </Button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}