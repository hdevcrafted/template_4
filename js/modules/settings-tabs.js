/**
 * Settings Tabs Module - Handles tab navigation and styling
 */

export function initSettingsTabs() {
  // Settings Tab Navigation
  document.querySelectorAll('.settings-tab').forEach(tab => {
    tab.addEventListener('click', function () {
      const tabName = this.getAttribute('data-tab');

      // Hide all panels
      document.querySelectorAll('.settings-panel').forEach(panel => {
        panel.classList.add('hidden');
      });

      // Remove active class from all tabs
      document.querySelectorAll('.settings-tab').forEach(t => {
        t.classList.remove('active');
      });

      // Show selected panel and mark tab as active
      document.getElementById(tabName + '-panel').classList.remove('hidden');
      this.classList.add('active');
    });
  });

  // Add CSS for active tab
  const style = document.createElement('style');
  style.textContent = `
    .settings-tab {
      background: none;
      border: none;
      color: var(--color-text-secondary);
      cursor: pointer;
      padding: 8px 0;
      font-size: 14px;
      transition: all var(--transition-base);
      border-bottom: 2px solid transparent;
    }

    .settings-tab:hover {
      color: var(--color-accent);
    }

    .settings-tab.active {
      color: var(--color-accent);
      border-bottom-color: var(--color-accent);
    }

    .gap-4 {
      gap: 32px;
    }
  `;
  document.head.appendChild(style);
}
