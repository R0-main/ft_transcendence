// Settings View - Account Management + 2FA
const Settings = {
    twoFactorSetup: null, // Store 2FA setup data
    
    render() {
        const app = document.getElementById('app');
        
        app.innerHTML = `
            <div class="view settings-view">
                <button class="back-btn" onclick="Router.navigate('home')" data-i18n="settingsPage.backBtn">← Back to Home</button>
                
                <div class="settings-header">
                    <h2 data-i18n="settingsPage.title">⚙️ Account Settings</h2>
                    <p data-i18n="settingsPage.subtitle">Manage your personal data and privacy</p>
                </div>

                <div class="settings-container">
                    <!-- 2FA Section -->
                    <section class="gdpr-section">
                        <h2 data-i18n="settingsPage.twoFactorTitle">🔐 Two-Factor Authentication (2FA)</h2>
                        
                        <div id="twoFactorSection" class="setting-card">
                            <div class="setting-icon">🔐</div>
                            <div class="setting-content">
                                <h3 id="twoFactorStatus">Loading...</h3>
                                <p id="twoFactorDesc">Checking status...</p>
                            </div>
                            <button id="twoFactorBtn" class="setting-btn" disabled>...</button>
                        </div>
                    </section>
                    
                    <!-- Account Section -->
                    <section class="gdpr-section">
                        <h2 data-i18n="settingsPage.title">🔒 Account & Privacy</h2>
                        
                        <!-- Export Data -->
                        <div class="setting-card">
                            <div class="setting-icon">📥</div>
                            <div class="setting-content">
                                <h3 data-i18n="settingsPage.downloadTitle">Download My Data</h3>
                                <p data-i18n="settingsPage.downloadDesc">Get a copy of all your personal information</p>
                            </div>
                            <button id="export-data-btn" class="setting-btn" data-i18n="settingsPage.downloadBtn">Download</button>
                        </div>

                        <!-- Delete Account -->
                        <div class="setting-card danger">
                            <div class="setting-icon">🗑️</div>
                            <div class="setting-content">
                                <h3 data-i18n="settingsPage.deleteTitle">Delete Account</h3>
                                <p data-i18n="settingsPage.deleteDesc">Permanently delete your account and all data</p>
                            </div>
                            <button id="delete-account-btn" class="setting-btn danger" data-i18n="settingsPage.deleteBtn">Delete</button>
                        </div>
                    </section>

                    <!-- Privacy Info -->
                    <div class="privacy-info">
                        <h3 data-i18n="settingsPage.privacyTitle">🔒 Your Privacy</h3>
                        <ul>
                            <li data-i18n="settingsPage.privacyItem1">Your data is stored securely on our servers</li>
                            <li data-i18n="settingsPage.privacyItem2">We never share your data with third parties</li>
                            <li data-i18n="settingsPage.privacyItem3">You can download or delete your data anytime</li>
                            <li data-i18n="settingsPage.privacyItem4">Full GDPR compliance</li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <!-- 2FA Setup Modal -->
            <div id="twoFactorModal" class="modal hidden">
                <div class="modal-content">
                    <h2 data-i18n="settingsPage.setup2FATitle">Setup 2FA</h2>
                    
                    <div id="qrCodeSection">
                        <p data-i18n="settingsPage.setup2FAStep1">1. Scan this QR code with your authenticator app</p>
                        <div id="qrCode" class="qr-container"></div>
                        <p class="hint" data-i18n="settingsPage.setup2FAApps">Recommended apps: Google Authenticator, Authy, Microsoft Authenticator</p>
                        
                        <p data-i18n="settingsPage.setup2FAStep2">2. Enter the 6-digit verification code</p>
                        <input type="text" id="verifyCode" class="input-code" maxlength="6" placeholder="000000" data-i18n-placeholder="settingsPage.verificationCode">
                        
                        <div class="modal-buttons">
                            <button id="verifyBtn" class="setting-btn" data-i18n="settingsPage.verifyAndEnable">Verify and Enable</button>
                            <button onclick="Settings.closeModal()" class="setting-btn" data-i18n="settingsPage.cancel">Cancel</button>
                        </div>
                    </div>
                    
                    <div id="backupCodesSection" class="hidden">
                        <div class="backup-codes-warning">
                            <p data-i18n="settingsPage.backupCodesWarning">⚠️ These codes will only be shown once!</p>
                        </div>
                        <h3 data-i18n="settingsPage.backupCodesTitle">Backup Codes</h3>
                        <p data-i18n="settingsPage.backupCodesDesc">Save these codes in a safe place. Each code can only be used once.</p>
                        <div id="backupCodesList" class="backup-codes"></div>
                        <div class="modal-buttons">
                            <button id="downloadCodesBtn" class="setting-btn" data-i18n="settingsPage.downloadBackupCodes">Download Codes</button>
                            <button id="copyCodesBtn" class="setting-btn" data-i18n="settingsPage.copyBackupCodes">Copy Codes</button>
                            <button onclick="Settings.closeModal(); Settings.loadTwoFactorStatus();" class="setting-btn" data-i18n="settingsPage.closeModal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        updatePageTranslations();
        this.loadTwoFactorStatus();
        this.initEventListeners();
    },

    async loadTwoFactorStatus() {
        try {
            const accessToken = localStorage.getItem('accessToken');

            // Si pas de token, afficher message approprié
            if (!accessToken) {
                const statusEl = document.getElementById('twoFactorStatus');
                const descEl = document.getElementById('twoFactorDesc');
                const btnEl = document.getElementById('twoFactorBtn');

                statusEl.textContent = 'Sign in required';
                statusEl.style.color = '#ff9800';
                descEl.textContent = 'Please sign in to manage 2FA settings';
                btnEl.style.display = 'none';
                return;
            }

            const response = await fetch('https://localhost:8443/api/auth/me', {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });

            const data = await response.json();

            if (data.authenticated && data.user) {
                const is2FAEnabled = data.user.two_factor_enabled;

                const statusEl = document.getElementById('twoFactorStatus');
                const descEl = document.getElementById('twoFactorDesc');
                const btnEl = document.getElementById('twoFactorBtn');

                if (is2FAEnabled) {
                    statusEl.textContent = t('settingsPage.twoFactorEnabled');
                    statusEl.style.color = '#4caf50';
                    descEl.textContent = 'Your account is protected with 2FA';
                    btnEl.textContent = t('settingsPage.disable2FA');
                    btnEl.className = 'setting-btn danger';
                    btnEl.disabled = false;
                    btnEl.style.display = 'block';
                    btnEl.onclick = () => this.disable2FA();
                } else {
                    statusEl.textContent = t('settingsPage.twoFactorDisabled');
                    statusEl.style.color = '#ff9800';
                    descEl.textContent = 'Protect your account with an extra layer of security';
                    btnEl.textContent = t('settingsPage.enable2FA');
                    btnEl.className = 'setting-btn';
                    btnEl.disabled = false;
                    btnEl.style.display = 'block';
                    btnEl.onclick = () => this.setup2FA();
                }
            } else {
                // Token invalide
                const statusEl = document.getElementById('twoFactorStatus');
                const descEl = document.getElementById('twoFactorDesc');
                const btnEl = document.getElementById('twoFactorBtn');

                statusEl.textContent = 'Authentication required';
                statusEl.style.color = '#ff9800';
                descEl.textContent = 'Please sign in to access 2FA settings';
                btnEl.style.display = 'none';
            }
        } catch (error) {
            console.error('Error loading 2FA status:', error);

            const statusEl = document.getElementById('twoFactorStatus');
            const descEl = document.getElementById('twoFactorDesc');
            const btnEl = document.getElementById('twoFactorBtn');

            statusEl.textContent = 'Error loading status';
            statusEl.style.color = '#f44336';
            descEl.textContent = 'Unable to check 2FA status. Please try again.';
            btnEl.style.display = 'none';
        }
    },

    async setup2FA() {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await fetch('https://localhost:8443/api/auth/2fa/setup', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });
            
            const data = await response.json();
            
            if (data.status === 'success') {
                this.twoFactorSetup = data.data;
                this.showSetupModal();
            } else {
                alert(t('settingsPage.twoFactorError'));
            }
        } catch (error) {
            console.error('Error setting up 2FA:', error);
            alert(t('settingsPage.twoFactorError'));
        }
    },

    showSetupModal() {
        const modal = document.getElementById('twoFactorModal');
        const qrCodeDiv = document.getElementById('qrCode');
        
        // Clear previous QR
        qrCodeDiv.innerHTML = '';
        
        // Generate QR code
        new QRCode(qrCodeDiv, {
            text: this.twoFactorSetup.otpauthUrl,
            width: 256,
            height: 256
        });
        
        modal.classList.remove('hidden');
        updatePageTranslations();
    },

    closeModal() {
        document.getElementById('twoFactorModal').classList.add('hidden');
        document.getElementById('qrCodeSection').classList.remove('hidden');
        document.getElementById('backupCodesSection').classList.add('hidden');
        document.getElementById('verifyCode').value = '';
    },

    async verify2FA() {
        const code = document.getElementById('verifyCode').value;
        
        if (code.length !== 6) {
            alert(t('settingsPage.invalidCode'));
            return;
        }
        
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await fetch('https://localhost:8443/api/auth/2fa/enable', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    secret: this.twoFactorSetup.secret,
                    token: code,
                    backupCodes: this.twoFactorSetup.backupCodes
                })
            });
            
            const data = await response.json();
            
            if (data.status === 'success') {
                this.showBackupCodes();
            } else {
                alert(t('settingsPage.invalidCode'));
            }
        } catch (error) {
            console.error('Error verifying 2FA:', error);
            alert(t('settingsPage.twoFactorError'));
        }
    },

    showBackupCodes() {
        document.getElementById('qrCodeSection').classList.add('hidden');
        document.getElementById('backupCodesSection').classList.remove('hidden');
        
        const codesList = document.getElementById('backupCodesList');
        codesList.innerHTML = this.twoFactorSetup.backupCodes
            .map(code => `<div class="backup-code">${code}</div>`)
            .join('');
        
        updatePageTranslations();
    },

    downloadBackupCodes() {
        const codes = this.twoFactorSetup.backupCodes.join('\n');
        const blob = new Blob([codes], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `2fa-backup-codes-${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    },

    copyBackupCodes() {
        const codes = this.twoFactorSetup.backupCodes.join('\n');
        navigator.clipboard.writeText(codes).then(() => {
            alert('✅ Backup codes copied to clipboard!');
        });
    },

    async disable2FA() {
        const code = prompt(t('settingsPage.enterCodePrompt'));
        
        if (!code) return;
        
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await fetch('https://localhost:8443/api/auth/2fa/disable', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token: code })
            });
            
            const data = await response.json();
            
            if (data.status === 'success') {
                alert(t('settingsPage.twoFactorDisableSuccess'));
                this.loadTwoFactorStatus();
            } else {
                alert(t('settingsPage.invalidCode'));
            }
        } catch (error) {
            console.error('Error disabling 2FA:', error);
            alert(t('settingsPage.twoFactorError'));
        }
    },

    initEventListeners() {
        // Verify button
        const verifyBtn = document.getElementById('verifyBtn');
        if (verifyBtn) {
            verifyBtn.addEventListener('click', () => this.verify2FA());
        }
        
        // Download codes button
        const downloadCodesBtn = document.getElementById('downloadCodesBtn');
        if (downloadCodesBtn) {
            downloadCodesBtn.addEventListener('click', () => this.downloadBackupCodes());
        }
        
        // Copy codes button
        const copyCodesBtn = document.getElementById('copyCodesBtn');
        if (copyCodesBtn) {
            copyCodesBtn.addEventListener('click', () => this.copyBackupCodes());
        }
        
        // Export button
        const exportBtn = document.getElementById('export-data-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', async () => {
                exportBtn.disabled = true;
                exportBtn.textContent = t('settingsPage.downloadProgress');
                
                try {
                    const accessToken = localStorage.getItem('accessToken');
                    const response = await fetch('https://localhost:8443/api/users/me/export', {
                        credentials: 'include',
                        headers: { 'Authorization': `Bearer ${accessToken}` }
                    });
                    
                    if (response.ok) {
                        const blob = await response.blob();
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `my_data_${Date.now()}.json`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        window.URL.revokeObjectURL(url);
                        
                        alert(t('settingsPage.downloadSuccess'));
                    } else {
                        alert(t('settingsPage.downloadError'));
                    }
                } catch (error) {
                    console.error('Export error:', error);
                    alert(t('settingsPage.downloadError'));
                } finally {
                    exportBtn.disabled = false;
                    exportBtn.textContent = t('settingsPage.downloadBtn');
                }
            });
        }

        // Delete button
        const deleteBtn = document.getElementById('delete-account-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', async () => {
                const confirmed = confirm(t('settingsPage.deleteConfirm'));
                
                if (!confirmed) return;
                
                try {
                    const accessToken = localStorage.getItem('accessToken');
                    const response = await fetch('https://localhost:8443/api/users/me', {
                        method: 'DELETE',
                        credentials: 'include',
                        headers: { 'Authorization': `Bearer ${accessToken}` }
                    });
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        alert(t('settingsPage.deleteSuccess'));
                        localStorage.clear();
                        window.location.href = '/';
                    } else {
                        alert(t('settingsPage.deleteError'));
                    }
                } catch (error) {
                    console.error('Delete error:', error);
                    alert(t('settingsPage.deleteError'));
                }
            });
        }
    }
};