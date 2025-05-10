import  { createContext, useContext, useState, } from 'react';
import { motion } from 'framer-motion';


// Create Tabs context
interface TabsContextType {
  value: string;
  onValueChange: (newValue: string) => void;
}

const TabsContext = createContext<TabsContextType | null>(null);


// Tabs component that wraps the entire tabs system
interface TabsProps {
  value?: string;
  onValueChange?: (newValue: string) => void;
  defaultValue?: string;
  className?: string;
  children: React.ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({ 
  value, 
  onValueChange, 
  defaultValue, 
  className = '', 
  children 
}) => {
  // If controlled component (value & onValueChange provided)
  const controlled = value !== undefined && onValueChange !== undefined;
  
  // State for uncontrolled component
  const [activeTab, setActiveTab] = useState(defaultValue || '');
  
  // Determine current value based on controlled/uncontrolled mode
  const currentValue = controlled ? value : activeTab;
  
  // Handle tab change
  const handleTabChange = (newValue: string) => {
    if (controlled) {
      onValueChange(newValue);
    } else {
      setActiveTab(newValue);
    }
  };
  
  // Context value
  const contextValue = {
    value: currentValue,
    onValueChange: handleTabChange
  };
  
  return (
    <TabsContext.Provider value={contextValue}>
      <div className={`w-full ${className}`}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};


// TabsList component that contains all triggers
export const TabsList: React.FC<{ className?: string; children: React.ReactNode }> = ({ className = '', children }) => {
  return (
    <div className={`flex gap-1 ${className}`}>
      {children}
    </div>
  );
};


// TabsTrigger component for individual tab buttons
interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ 
  value, 
  children, 
  className = '',
  disabled = false 
}) => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('TabsTrigger must be used within a Tabs provider');
  }
  const { value: selectedValue, onValueChange } = context;
  const isActive = selectedValue === value;
  
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onValueChange(value)}
      className={`
        relative transition-all duration-200 ease-in-out
        outline-none focus:outline-none 
        ${isActive ? 'font-medium' : 'font-normal'} 
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} 
        ${className}
      `}
      data-state={isActive ? 'active' : 'inactive'}
    >
      {children}
      
      {/* Optional: Animated underline for active state */}
      {isActive && (
        <motion.div
          layoutId="TabsUnderline"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-current"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </button>
  );
};


// TabsContent component for content associated with each tab
interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  forceMount?: boolean;
}

export const TabsContent: React.FC<TabsContentProps> = ({ 
  value, 
  children, 
  className = '',
  forceMount = false 
}) => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('TabsContent must be used within a Tabs provider');
  }
  const { value: selectedValue } = context;
  const isSelected = selectedValue === value;
  
  // If not selected and not forcing mount, don't render
  if (!isSelected && !forceMount) {
    return null;
  }
  
  return (
    <div
      className={`outline-none ${className} ${!isSelected && forceMount ? 'hidden' : ''}`}
      role="tabpanel"
      tabIndex={0}
      data-state={isSelected ? 'active' : 'inactive'}
    >
      {children}
    </div>
  );
};


// Export a complete Tabs package
export { TabsContext };
