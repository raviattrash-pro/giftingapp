import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useUiStore } from '../../store/uiStore';
import { Search, Edit2, Trash2, Shield, User, DollarSign, ShieldAlert, ToggleLeft, ToggleRight } from 'lucide-react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Select from '../../components/ui/Select';
import Badge from '../../components/ui/Badge';
import AnimatedAvatar from '../../components/ui/AnimatedAvatar';

const AdminUsersPage = () => {
  const { users, fetchUsers, updateUserByAdmin, deleteUserByAdmin } = useAuthStore();
  const { addToast } = useUiStore();

  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Form state
  const [role, setRole] = useState('USER');
  const [status, setStatus] = useState('Active');
  const [budget, setBudget] = useState('2000');
  const [featureFlags, setFeatureFlags] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = users.filter((u) => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openEditModal = (user) => {
    setSelectedUser(user);
    setRole(user.role);
    setStatus(user.status || 'Active');
    setBudget((user.budget || 0).toString());
    setFeatureFlags(user.featureFlags || {});
    setErrors({});
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!budget || isNaN(budget) || parseFloat(budget) < 0) {
      newErrors.budget = 'Please enter a valid budget allocation (0 or more)';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await updateUserByAdmin(selectedUser.id, {
        role,
        monthlyBudget: parseFloat(budget),
        premium: true,
        featureFlags
      });
      addToast(`Updated settings for "${selectedUser.name}" successfully.`, 'success');
      setIsEditModalOpen(false);
    } catch (err) {
      addToast('Failed to update user parameters.', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;
    try {
      await deleteUserByAdmin(selectedUser.id);
      addToast(`User account "${selectedUser.name}" has been deleted.`, 'success');
      setIsDeleteModalOpen(false);
    } catch (err) {
      addToast('Failed to delete user account.', 'error');
    }
  };

  const roleOptions = [
    { value: 'ADMIN', label: 'System Admin' },
    { value: 'USER', label: 'Premium Member' }
  ];

  const statusOptions = [
    { value: 'Active', label: 'Active Access' },
    { value: 'Suspended', label: 'Suspended' }
  ];

  const featureFlagOptions = [
    { key: 'aiAssistant', label: 'AI Assistant' },
    { key: 'budgetPlanner', label: 'Budget Planner' },
    { key: 'groupGifting', label: 'Group Gifting' },
    { key: 'secretSanta', label: 'Secret Santa' },
    { key: 'giftStories', label: 'Gift Stories' },
    { key: 'futureLocker', label: 'Future Locker' }
  ];

  const toggleFeatureFlag = (flagKey) => {
    setFeatureFlags((current) => ({
      ...current,
      [flagKey]: current[flagKey] === false
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Title Header */}
      <div className="flex-between" style={{ flexWrap: 'wrap', gap: '16px' }}>
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
            User Account Management
          </h1>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
            Monitor corporate client permissions, change role profiles, allocate department budgets, or suspend accounts.
          </p>
        </div>
      </div>

      {/* Roster Search bar */}
      <Card hoverable={false} style={{ padding: '16px' }}>
        <Input
          icon={Search}
          placeholder="Search user by name or corporate email address..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginBottom: 0 }}
        />
      </Card>

      {/* Users table */}
      <Card hoverable={false} style={{ padding: '0px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--glass-border)', background: 'rgba(255, 255, 255, 0.02)' }}>
              <th style={{ padding: '16px 20px', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>User</th>
              <th style={{ padding: '16px 20px', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Role</th>
              <th style={{ padding: '16px 20px', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Status</th>
              <th style={{ padding: '16px 20px', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Budget Allocated</th>
              <th style={{ padding: '16px 20px', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '48px', textAlignment: 'center', color: 'var(--text-muted)', textAlign: 'center' }}>
                  No members found matching that search.
                </td>
              </tr>
            ) : (
              filteredUsers.map((userItem) => (
                <tr 
                  key={userItem.id} 
                  style={{ 
                    borderBottom: '1px solid rgba(255, 255, 255, 0.03)', 
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.01)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  {/* User Profile */}
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <AnimatedAvatar src={userItem.avatar} name={userItem.name} size="sm" />
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{userItem.name}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{userItem.email}</span>
                      </div>
                    </div>
                  </td>
                  {/* Role */}
                  <td style={{ padding: '16px 20px', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {userItem.role === 'ADMIN' ? (
                        <>
                          <Shield size={14} color="var(--color-primary)" />
                          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>System Admin</span>
                        </>
                      ) : (
                        <>
                          <User size={14} color="var(--text-secondary)" />
                          <span style={{ color: 'var(--text-secondary)' }}>Premium Member</span>
                        </>
                      )}
                    </div>
                  </td>
                  {/* Status */}
                  <td style={{ padding: '16px 20px' }}>
                    <Badge variant={userItem.status === 'Suspended' ? 'danger' : 'success'}>
                      {userItem.status || 'Active'}
                    </Badge>
                  </td>
                  {/* Budget Limit */}
                  <td style={{ padding: '16px 20px', fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-secondary)' }}>
                    ${userItem.budget !== undefined ? userItem.budget : 2000}
                  </td>
                  {/* Actions */}
                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button 
                        onClick={() => openEditModal(userItem)}
                        style={{
                          background: 'rgba(255,255,255,0.02)',
                          border: '1px solid var(--glass-border)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '6px 10px',
                          cursor: 'pointer',
                          color: 'var(--text-secondary)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Edit2 size={14} /> Adjust Options
                      </button>
                      <button 
                        onClick={() => openDeleteModal(userItem)}
                        style={{
                          background: 'rgba(255, 0, 127, 0.05)',
                          border: '1px solid rgba(255, 0, 127, 0.2)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '6px 10px',
                          cursor: 'pointer',
                          color: 'var(--color-danger)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>

      {/* Edit User Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Adjust Options for: ${selectedUser?.name}`}
        size="md"
      >
        <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <Select
            label="System Access Role"
            options={roleOptions}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />

          <Select
            label="Account Status"
            options={statusOptions}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />

          <Input
            label="Allocated Spending Budget (USD)"
            type="number"
            placeholder="e.g. 5000"
            value={budget}
            onChange={(e) => { setBudget(e.target.value); setErrors({ ...errors, budget: '' }); }}
            error={errors.budget}
            icon={DollarSign}
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '10px' }}>
            {featureFlagOptions.map((flag) => {
              const active = featureFlags[flag.key] !== false;
              return (
                <button
                  key={flag.key}
                  type="button"
                  onClick={() => toggleFeatureFlag(flag.key)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--glass-border)',
                    background: active ? 'rgba(32, 201, 151, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                    color: active ? 'var(--color-success)' : 'var(--text-muted)',
                    cursor: 'pointer',
                    fontSize: '0.78rem',
                    fontWeight: 600
                  }}
                >
                  <span style={{ color: 'var(--text-primary)' }}>{flag.label}</span>
                  {active ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
            <Button type="button" onClick={() => setIsEditModalOpen(false)} variant="glass">
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Options
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete User Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete User Account"
        size="sm"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <ShieldAlert color="var(--color-danger)" size={24} style={{ flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600, marginBottom: '6px' }}>
                Are you absolutely sure?
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                This will permanently delete the membership account for <strong>{selectedUser?.name}</strong> ({selectedUser?.email}) and revoke all portal permissions.
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
            <Button onClick={() => setIsDeleteModalOpen(false)} variant="glass">
              Cancel
            </Button>
            <Button onClick={handleDeleteConfirm} variant="danger">
              Confirm Permanent Deletion
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default AdminUsersPage;
