import { useState, useEffect } from "react";
import { X, Search, Users, Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { searchUsersAPI } from "../../api/userApi";
import { createGroupAPI } from "../../api/chatApi/chatsApi";
import { toast } from "react-toastify"
export function CreateGroupModal({ isOpen, onClose, onGroupCreated }) {
    const [step, setStep] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [groupName, setGroupName] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setGroupName("");
            setSelectedUsers([]);
            setSearchQuery("");
            setSearchResults([]);
        }
    }, [isOpen]);


    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchQuery.trim().length > 1) {
                setIsSearching(true);
                const response = await searchUsersAPI(searchQuery);
                if (response.success) {
                    setSearchResults(response.data);
                }
                setIsSearching(false);
            } else {
                setSearchResults([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    const toggleUser = (user) => {
        if (selectedUsers.find((u) => u.id === user.id)) {
            setSelectedUsers(prev => prev.filter((u) => u.id !== user.id));
        } else {
            setSelectedUsers(prev => [...prev, user]);
        }
    };

    const handleCreateGroup = async () => {
        if (!groupName.trim() || selectedUsers.length === 0) return;

        setIsCreating(true);
        const participantIds = selectedUsers.map(u => u.id);

        const response = await createGroupAPI({
            name: groupName,
            participants: participantIds,
        });

        setIsCreating(false);

        if (response.success) {
            toast.success("Group created successfully");
            onGroupCreated();
            onClose();
        } else {
            toast.error("Failed to create group");
        }
    };

    if (!isOpen) return null;

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
                    className="bg-card w-full max-w-md rounded-xl shadow-2xl overflow-hidden border border-border flex flex-col max-h-[80vh]"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="p-4 border-b border-border flex items-center justify-between">
                        <h2 className="font-semibold text-lg flex items-center gap-2">
                            <Users className="w-5 h-5 text-primary" />
                            {step === 1 ? "Add Participants" : "New Group"}
                        </h2>
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto p-4">
                        {step === 1 ? (
                            <>
                                {/* Search Input */}
                                <div className="relative mb-4">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search people..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-9 bg-muted/50"
                                    />
                                </div>

                                {/* Selected Pills */}
                                {selectedUsers.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {selectedUsers.map((user) => (
                                            <div key={user.id} className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                                                {user.full_name}
                                                <X
                                                    className="w-3 h-3 cursor-pointer hover:text-red-500"
                                                    onClick={() => toggleUser(user)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* User List */}
                                <div className="space-y-2">
                                    {isSearching ? (
                                        <div className="flex justify-center py-4"><Loader2 className="animate-spin text-muted-foreground" /></div>
                                    ) : searchResults.length > 0 ? (
                                        searchResults.map((user) => {
                                            const isSelected = selectedUsers.find(u => u.id === user.id);
                                            return (
                                                <div
                                                    key={user.id}
                                                    onClick={() => toggleUser(user)}
                                                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${isSelected ? "bg-primary/10" : "hover:bg-accent"
                                                        }`}
                                                >
                                                    <Avatar>
                                                        <AvatarImage src={user.profile_image} />
                                                        <AvatarFallback>{user.full_name?.[0]}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1">
                                                        <p className="font-medium text-sm">{user.full_name}</p>
                                                        <p className="text-xs text-muted-foreground">@{user.username}</p>
                                                    </div>
                                                    {isSelected && <Check className="w-4 h-4 text-primary" />}
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p className="text-center text-muted-foreground text-sm py-4">
                                            {searchQuery ? "No users found" : "Type to search people"}
                                        </p>
                                    )}
                                </div>
                            </>
                        ) : (
                            // Step 2: Name Group
                            <div className="py-6 space-y-6">
                                <div className="flex justify-center">
                                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center border-2 border-dashed border-muted-foreground/50">
                                        <Users className="w-8 h-8 text-muted-foreground" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium ml-1">Group Name</label>
                                    <Input
                                        placeholder="e.g. Weekend Trip 🌴"
                                        value={groupName}
                                        onChange={(e) => setGroupName(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                                <div className="text-sm text-muted-foreground text-center">
                                    {selectedUsers.length} participants selected
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-border flex justify-end gap-2 bg-muted/20">
                        {step === 1 ? (
                            <Button
                                onClick={() => setStep(2)}
                                disabled={selectedUsers.length === 0}
                            >
                                Next
                            </Button>
                        ) : (
                            <>
                                <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                                <Button onClick={handleCreateGroup} disabled={!groupName.trim() || isCreating}>
                                    {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Create Group
                                </Button>
                            </>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}