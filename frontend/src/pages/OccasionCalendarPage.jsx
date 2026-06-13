import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Users, Gift, Info, Trash2, Edit2 } from 'lucide-react';
import { useOccasionStore } from '../store/occasionStore';
import { useRecipientStore } from '../store/recipientStore';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';

const OccasionCalendarPage = () => {
  const { occasions, addOccasion, updateOccasion, deleteOccasion } = useOccasionStore();
  const { recipients } = useRecipientStore();
  
  // Set default calendar focus month to June 2026 based on metadata
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(5); // 0-indexed, so 5 is June
  const [selectedDate, setSelectedDate] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    date: '',
    type: 'Birthday',
    urgency: 'medium',
    budget: 0,
    recipientId: ''
  });

  const monthsList = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Helper to generate days of the month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  // Month navigation
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDate(null);
  };

  // Find occasions for a specific day in the currently selected month
  const getOccasionsForDay = (day) => {
    const formattedDay = String(day).padStart(2, '0');
    const formattedMonth = String(currentMonth + 1).padStart(2, '0');
    const dateStr = `${currentYear}-${formattedMonth}-${formattedDay}`;
    return occasions.filter((o) => o.date === dateStr);
  };

  const handleOpenModal = (event = null) => {
    if (event) {
      setEditingEvent(event);
      setEventForm({
        title: event.title || '',
        date: event.date || '',
        type: event.type || 'Birthday',
        urgency: event.urgency || 'medium',
        budget: event.budget || 0,
        recipientId: event.recipientId || ''
      });
    } else {
      setEditingEvent(null);
      const defaultDate = selectedDate 
        ? `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`
        : '';
      setEventForm({
        title: '',
        date: defaultDate,
        type: 'Birthday',
        urgency: 'medium',
        budget: 0,
        recipientId: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveEvent = async () => {
    const selectedRecipient = recipients.find(r => String(r.id) === String(eventForm.recipientId));
    const eventPayload = {
      ...eventForm,
      recipientName: selectedRecipient ? selectedRecipient.name : 'Unknown',
      budget: Number(eventForm.budget)
    };

    if (editingEvent) {
      await updateOccasion(editingEvent.id, eventPayload);
    } else {
      await addOccasion(eventPayload);
    }
    setIsModalOpen(false);
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      await deleteOccasion(id);
      if (editingEvent && editingEvent.id === id) {
        setIsModalOpen(false);
      }
    }
  };

  // Grid generator
  const renderCalendarCells = () => {
    const cells = [];
    
    // Empty cells before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} style={{ opacity: 0.15, border: '1px solid var(--glass-border)' }} />);
    }

    // Days in the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayOccasions = getOccasionsForDay(day);
      const hasOccasions = dayOccasions.length > 0;
      const isSelected = selectedDate === day;

      let cellGlowStyle = {};
      if (hasOccasions) {
        const primaryUrgency = dayOccasions.some((o) => o.urgency === 'high') ? 'high' : 'medium';
        const color = primaryUrgency === 'high' ? 'var(--color-danger)' : 'var(--color-primary)';
        cellGlowStyle = {
          border: `1px solid ${color}88`,
          background: `rgba(255, 255, 255, 0.02)`,
          boxShadow: `inset 0 0 10px ${color}15`
        };
      }

      cells.push(
        <div
          key={`day-${day}`}
          onClick={() => setSelectedDate(day)}
          style={{
            minHeight: '80px',
            padding: '8px',
            border: '1px solid var(--glass-border)',
            cursor: 'pointer',
            transition: 'var(--transition-fast)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            background: isSelected ? 'rgba(157, 78, 221, 0.06)' : 'transparent',
            borderColor: isSelected ? 'var(--color-primary)' : 'var(--glass-border)',
            ...cellGlowStyle
          }}
          onMouseEnter={(e) => {
            if (!isSelected) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
          }}
          onMouseLeave={(e) => {
            if (!isSelected) e.currentTarget.style.background = hasOccasions ? 'rgba(255,255,255,0.02)' : 'transparent';
          }}
        >
          <span 
            style={{ 
              fontSize: '0.8rem', 
              fontWeight: isSelected || hasOccasions ? 700 : 400,
              color: isSelected ? '#ffffff' : hasOccasions ? 'var(--color-accent)' : 'var(--text-secondary)'
            }}
          >
            {day}
          </span>

          {/* Mini Event Indicators */}
          {hasOccasions && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              {dayOccasions.map((o) => (
                <div
                  key={o.id}
                  style={{
                    fontSize: '0.65rem',
                    padding: '2px 4px',
                    borderRadius: '3px',
                    background: o.urgency === 'high' ? 'rgba(255, 0, 127, 0.15)' : 'rgba(157, 78, 221, 0.15)',
                    border: '1px solid',
                    borderColor: o.urgency === 'high' ? 'rgba(255, 0, 127, 0.3)' : 'rgba(157, 78, 221, 0.3)',
                    color: '#ffffff',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {o.recipientName.split(' ')[0]}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    return cells;
  };

  // Find occasions selected date highlights
  const selectedOccasions = selectedDate ? getOccasionsForDay(selectedDate) : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Title */}
      <div className="flex-between">
        <div>
          <h1 
            style={{ 
              fontFamily: 'var(--font-title)', 
              fontWeight: 800, 
              fontSize: '2rem',
              background: 'var(--text-gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '6px'
            }}
          >
            Occasion Calendar
          </h1>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
            Monitor your corporate milestones and secure critical deliveries.
          </p>
        </div>
        <Button onClick={() => handleOpenModal()} icon={Plus}>
          Add Event
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '8fr 4fr', gap: '24px' }}>
        
        {/* Calendar Core Card */}
        <Card hoverable={false} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Calendar Controller Header */}
          <div className="flex-between">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CalendarIcon size={20} className="text-gradient-purple" />
              <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-title)' }}>
                {monthsList[currentMonth]} {currentYear}
              </h3>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handlePrevMonth}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--glass-border)',
                  color: 'var(--text-secondary)',
                  padding: '6px',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer'
                }}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={handleNextMonth}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--glass-border)',
                  color: 'var(--text-secondary)',
                  padding: '6px',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer'
                }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Weekday Titles Grid */}
          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(7, 1fr)', 
              textAlign: 'center',
              borderBottom: '1px solid var(--glass-border)',
              paddingBottom: '8px'
            }}
          >
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <span key={d} style={{ fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                {d}
              </span>
            ))}
          </div>

          {/* Day Cells Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', background: 'rgba(255, 255, 255, 0.03)' }}>
            {renderCalendarCells()}
          </div>

        </Card>

        {/* Side Details List Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <Card hoverable={false}>
            <h3 style={{ fontSize: '1.15rem', fontFamily: 'var(--font-title)', marginBottom: '16px' }}>
              {selectedDate ? `Events for June ${selectedDate}` : 'Select a Date'}
            </h3>

            {selectedDate ? (
              selectedOccasions.length === 0 ? (
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center', padding: '24px 0' }}>
                  No gifting milestones scheduled for this date.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {selectedOccasions.map((o) => {
                    const rec = recipients.find((r) => String(r.id) === String(o.recipientId));
                    return (
                      <div 
                        key={o.id}
                        style={{
                          padding: '16px',
                          borderRadius: 'var(--radius-md)',
                          background: 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid var(--glass-border)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '12px'
                        }}
                      >
                        <div className="flex-between">
                          <Badge variant={o.urgency === 'high' ? 'danger' : 'info'}>
                            {o.type}
                          </Badge>
                          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-secondary)' }}>
                            Budget: ₹{o.budget}
                          </span>
                        </div>
                        
                        <div>
                          <div className="flex-between" style={{ alignItems: 'flex-start' }}>
                            <div>
                              <h4 style={{ fontSize: '0.92rem', fontWeight: 600, marginBottom: '2px' }}>{o.title}</h4>
                              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Recipient: {o.recipientName}</p>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button onClick={() => handleOpenModal(o)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }} title="Edit Event">
                                <Edit2 size={14} />
                              </button>
                              <button onClick={() => handleDeleteEvent(o.id)} style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer' }} title="Delete Event">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>

                        {rec && (
                          <div 
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              fontSize: '0.72rem',
                              color: 'var(--text-secondary)',
                              borderTop: '1px solid rgba(255,255,255,0.03)',
                              paddingTop: '8px'
                            }}
                          >
                            <Users size={12} />
                            <span>Prefers {rec.preferences?.brands?.slice(0, 2).join(', ')}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )
            ) : (
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center', padding: '24px 0' }}>
                Click on any highlighted cell to reveal detailed event notes.
              </p>
            )}
          </Card>

          {/* Month Roster summary */}
          <Card hoverable={false}>
            <h3 style={{ fontSize: '1.15rem', fontFamily: 'var(--font-title)', marginBottom: '16px' }}>
              June Milestones
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {occasions
                .filter((o) => o.date.startsWith(`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`))
                .map((o) => (
                  <div 
                    key={o.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.8rem',
                      paddingBottom: '8px',
                      borderBottom: '1px solid rgba(255,255,255,0.02)'
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: 600 }}>{o.recipientName}</span>
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{o.title}</p>
                    </div>
                    <Badge variant={o.urgency === 'high' ? 'danger' : 'primary'}>
                      {o.date.split('-')[2]}th
                    </Badge>
                  </div>
                ))}
            </div>
          </Card>

        </div>

      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingEvent ? "Edit Event" : "Add Event"}
        width="500px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Input 
            label="Event Title" 
            placeholder="e.g. Birthday Celebration" 
            value={eventForm.title} 
            onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} 
            required 
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Input 
              label="Date" 
              type="date" 
              value={eventForm.date} 
              onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })} 
              required 
            />
            <Select 
              label="Event Type" 
              value={eventForm.type} 
              onChange={(e) => setEventForm({ ...eventForm, type: e.target.value })} 
              options={[{ value: 'Birthday', label: 'Birthday' }, { value: 'Anniversary', label: 'Anniversary' }, { value: 'Promotion', label: 'Promotion' }, { value: 'Corporate Meeting', label: 'Corporate Meeting' }, { value: 'Holiday', label: 'Holiday' }, { value: 'Other', label: 'Other' }]} 
            />
          </div>
          <Select 
            label="Recipient" 
            value={eventForm.recipientId} 
            onChange={(e) => setEventForm({ ...eventForm, recipientId: e.target.value })} 
            options={[
              { value: '', label: 'Select a Recipient' },
              ...recipients.map(r => ({ value: r.id, label: r.name }))
            ]} 
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Select 
              label="Urgency" 
              value={eventForm.urgency} 
              onChange={(e) => setEventForm({ ...eventForm, urgency: e.target.value })} 
              options={[{ value: 'low', label: 'Low' }, { value: 'medium', label: 'Medium' }, { value: 'high', label: 'High' }]} 
            />
            <Input 
              label="Budget (₹)" 
              type="number" 
              placeholder="e.g. 500" 
              value={eventForm.budget} 
              onChange={(e) => setEventForm({ ...eventForm, budget: e.target.value })} 
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSaveEvent}>{editingEvent ? "Save Changes" : "Add Event"}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default OccasionCalendarPage;
