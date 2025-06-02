import { useState } from "react";
import { Eye, EyeOff, Copy, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
interface ApiKey {
  id: string;
  name: string;
  key: string;
  created: string;
}
const Settings = () => {
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Developer"
  });
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([{
    id: "1",
    name: "OpenAI API Key",
    key: "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    created: "2024-01-15"
  }, {
    id: "2",
    name: "Azure OpenAI Key",
    key: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    created: "2024-01-10"
  }]);
  const [preferences, setPreferences] = useState({
    theme: "light",
    language: "en",
    defaultModel: "gpt-4"
  });
  const [showKeys, setShowKeys] = useState<{
    [key: string]: boolean;
  }>({});
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyValue, setNewKeyValue] = useState("");
  const toggleKeyVisibility = (keyId: string) => {
    setShowKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "API key has been copied to your clipboard."
    });
  };
  const deleteApiKey = (keyId: string) => {
    setApiKeys(apiKeys.filter(key => key.id !== keyId));
    toast({
      title: "API Key deleted",
      description: "The API key has been removed."
    });
  };
  const addApiKey = () => {
    if (!newKeyName || !newKeyValue) {
      toast({
        title: "Error",
        description: "Please provide both name and API key.",
        variant: "destructive"
      });
      return;
    }
    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: newKeyValue,
      created: new Date().toISOString().split('T')[0]
    };
    setApiKeys([...apiKeys, newKey]);
    setNewKeyName("");
    setNewKeyValue("");
    toast({
      title: "API Key added",
      description: "Your new API key has been saved."
    });
  };
  const saveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully."
    });
  };
  return <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account and preferences</p>
      </div>

      <div className="space-y-8">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Name</Label>
                <Input value={profile.name} onChange={e => setProfile({
                ...profile,
                name: e.target.value
              })} className="mt-1" />
              </div>
              <div>
                <Label>Role</Label>
                <Input value={profile.role} onChange={e => setProfile({
                ...profile,
                role: e.target.value
              })} className="mt-1" />
              </div>
            </div>
            <div>
              <Label>Email</Label>
              <Input value={profile.email} readOnly className="mt-1 bg-gray-50" />
            </div>
          </CardContent>
        </Card>

        {/* API Keys */}
        

        {/* Preferences */}
        

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={saveSettings} className="bg-blue-600 hover:bg-blue-700">
            Save Changes
          </Button>
        </div>
      </div>
    </div>;
};
export default Settings;