'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppStore } from '@/stores';
import { generateId } from '@/lib/utils/helpers';
import { Bell, Plus, Trash2, BellOff, Info, AlertTriangle } from 'lucide-react';

export function AlertsPage() {
  const { alerts, addAlert, removeAlert } = useAppStore();
  const [formData, setFormData] = useState({ coin: '', condition: 'above', price: '' });

  const handleAdd = () => {
    if (!formData.coin || !formData.price) return;
    addAlert({
      id: generateId(),
      type: 'price',
      target_id: formData.coin.toLowerCase(),
      target_name: formData.coin,
      condition: formData.condition as 'above' | 'below',
      value: parseFloat(formData.price),
      active: true,
      triggered: false,
      created_at: new Date().toISOString(),
    });
    setFormData({ coin: '', condition: 'above', price: '' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Bell className="h-8 w-8 text-bitcoin" />
          Price Alerts
        </h1>
        <p className="text-muted-foreground mt-1">Set price alerts to track your favorite coins.</p>
      </div>

      <Card className="border-yellow-500/20 bg-yellow-500/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">How Alerts Work</p>
              <p className="text-sm text-muted-foreground mt-1">
                Create price alerts to track when coins go above or below your target price.
                Alerts are saved locally in your browser. For real-time push notifications,
                you would need to enable browser notifications or use our mobile app (coming soon).
                Check back here to see your saved alerts.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Alert
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="Coin (e.g., Bitcoin)"
              value={formData.coin}
              onChange={(e) => setFormData({ ...formData, coin: e.target.value })}
              className="flex-1"
            />
            <Select
              value={formData.condition}
              onValueChange={(v) => setFormData({ ...formData, condition: v })}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="above">Goes Above</SelectItem>
                <SelectItem value="below">Goes Below</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Price ($)"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-[140px]"
            />
            <Button onClick={handleAdd} variant="bitcoin">
              Create
            </Button>
          </div>
        </CardContent>
      </Card>

      {alerts.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Your Alerts ({alerts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    {alert.active ? (
                      <Bell className="h-5 w-5 text-bitcoin" />
                    ) : (
                      <BellOff className="h-5 w-5 text-muted-foreground" />
                    )}
                    <div>
                      <p className="font-medium">{alert.target_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {alert.condition === 'above' ? 'Above' : 'Below'} ${alert.value.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={alert.active ? 'green' : 'secondary'}>
                      {alert.active ? 'Active' : 'Inactive'}
                    </Badge>
                    <Button variant="ghost" size="icon" onClick={() => removeAlert(alert.id)}>
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No alerts yet</h3>
            <p className="text-muted-foreground mb-4">Create your first price alert above to start tracking coins.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
