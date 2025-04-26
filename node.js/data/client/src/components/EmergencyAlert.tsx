import { useTranslation } from 'react-i18next';
import { useEmergencyAlerts } from '@/hooks/useEmergencyAlerts';

const EmergencyAlert = () => {
  const { t } = useTranslation();
  const { data: alerts, isLoading } = useEmergencyAlerts();

  if (isLoading || !alerts || alerts.length === 0) {
    return null;
  }

  return (
    <div className="bg-destructive text-destructive-foreground px-4 py-2 text-center">
      {alerts.map((alert, index) => (
        <p key={alert.id || index} className="font-medium">{alert.message}</p>
      ))}
    </div>
  );
};

export default EmergencyAlert;
