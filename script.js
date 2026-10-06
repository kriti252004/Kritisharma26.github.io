// Script for Kriti Sharma Portfolio Website

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileMenu();
  initActiveNav();
  initProjectFilter();
  initCodeTerminal();
  initContactForm();
  initBackToTop();
  initLucideIcons();
});

// Initialize Lucide icons if available
function initLucideIcons() {
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}

// 1. Theme Management (Dark / Light mode)
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  
  // Default to dark mode if not explicitly saved as 'light'
  const savedTheme = localStorage.getItem('theme') || 'dark';
  
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
    updateThemeIcon(true);
  } else {
    document.documentElement.classList.remove('dark');
    updateThemeIcon(false);
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      updateThemeIcon(isDark);
    });
  }
}

function updateThemeIcon(isDark) {
  const themeIcon = document.getElementById('theme-icon');
  if (!themeIcon) return;
  
  if (isDark) {
    themeIcon.innerHTML = `
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>`;
  } else {
    themeIcon.innerHTML = `
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>`;
  }
}

// 2. Mobile Menu Navigation
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!menuBtn || !mobileMenu) return;

  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
    });
  });
}

// 3. Active Nav Link on Scroll
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.pageYOffset + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('text-blue-500', 'font-semibold');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('text-blue-500', 'font-semibold');
      }
    });
  });
}

// 4. Project Category Filter
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('bg-blue-600', 'text-white', 'shadow-md');
        b.classList.add('bg-slate-800/60', 'text-slate-300', 'dark:bg-slate-800/80');
      });

      btn.classList.add('bg-blue-600', 'text-white', 'shadow-md');
      btn.classList.remove('bg-slate-800/60', 'text-slate-300');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category').includes(filter)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

// 5. Code Terminal Tab Switcher
const codeSnippets = {
  billing: `// UBQ Technology - Medics Healthcare System
@Service
@Transactional
public class BillingServiceImpl implements BillingService {

    private final BillingRepository billingRepo;
    private final InvoiceDataModelMapper mapper;

    @Autowired
    public BillingServiceImpl(BillingRepository repo, InvoiceDataModelMapper mapper) {
        this.billingRepo = repo;
        this.mapper = mapper;
    }

    @Override
    public InvoiceDTO processPatientBill(Long patientId, BillRequestDTO request) {
        // High-precision healthcare billing & audit logging
        PatientDataModel patient = billingRepo.findPatientById(patientId)
            .orElseThrow(() -> new ResourceNotFoundException("Patient not found: " + patientId));

        BigDecimal total = request.getItems().stream()
            .map(ItemDTO::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        InvoiceEntity invoice = mapper.toEntity(request, total, patient);
        return mapper.toDto(billingRepo.save(invoice));
    }
}`,

  inventory: `// Smart Inventory Management - Spring Boot REST API
@RestController
@RequestMapping("/api/v1/inventory")
@CrossOrigin(origins = "*")
public class InventoryController {

    @Autowired
    private ProductService productService;

    @GetMapping("/alerts/low-stock")
    public ResponseEntity<List<ProductDTO>> getLowStockAlerts(
            @RequestParam(defaultValue = "10") int threshold) {
        List<ProductDTO> items = productService.findProductsBelowThreshold(threshold);
        return ResponseEntity.ok(items);
    }

    @GetMapping("/alerts/expiring")
    public ResponseEntity<List<ProductDTO>> getExpiringSoon(
            @RequestParam(defaultValue = "30") int daysUntilExpiry) {
        return ResponseEntity.ok(productService.findExpiringProducts(daysUntilExpiry));
    }
}`,

  dao: `// Employee Management System - J2EE DAO Pattern
public class EmployeeDAOImpl implements EmployeeDAO {

    private final Connection connection;

    public EmployeeDAOImpl(Connection connection) {
        this.connection = connection;
    }

    @Override
    public Optional<EmployeeDTO> findById(int id) throws SQLException {
        String sql = "SELECT emp_id, name, dept, salary FROM employees WHERE emp_id = ?";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setInt(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    EmployeeDTO emp = new EmployeeDTO(
                        rs.getInt("emp_id"),
                        rs.getString("name"),
                        rs.getString("dept"),
                        rs.getDouble("salary")
                    );
                    return Optional.of(emp);
                }
            }
        }
        return Optional.empty();
    }
}`
};

function initCodeTerminal() {
  const tabs = document.querySelectorAll('.code-tab-btn');
  const codeDisplay = document.getElementById('code-display');
  const fileNameDisplay = document.getElementById('code-file-name');

  if (!codeDisplay) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('bg-slate-700/80', 'text-blue-400', 'border-b-2', 'border-blue-500');
        t.classList.add('text-slate-400', 'hover:text-slate-200');
      });

      tab.classList.add('bg-slate-700/80', 'text-blue-400', 'border-b-2', 'border-blue-500');
      tab.classList.remove('text-slate-400');

      const snippetKey = tab.getAttribute('data-snippet');
      if (codeSnippets[snippetKey]) {
        codeDisplay.textContent = codeSnippets[snippetKey];
        if (fileNameDisplay) {
          fileNameDisplay.textContent = tab.getAttribute('data-filename') || 'Source.java';
        }
      }
    });
  });
}

// 6. Copy to Clipboard Functionality
function copyToClipboard(text, label) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(`Copied ${label} to clipboard: ${text}`);
  }).catch(() => {
    showToast(`Failed to copy to clipboard`);
  });
}

// 7. Toast Notification Utility
function showToast(message) {
  const existing = document.getElementById('custom-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'custom-toast';
  toast.className = 'fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-slate-900 border border-emerald-500/50 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-3 toast-enter text-sm font-medium';
  toast.innerHTML = `
    <span class="inline-flex p-1 bg-emerald-500/20 text-emerald-400 rounded-full">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
    </span>
    <span>${message}</span>
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

// 8. Contact Form Handler
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('sender-name')?.value || 'Friend';
    showToast(`Thank you, ${name}! Your message has been prepared.`);
    form.reset();
  });
}

// 9. Back to Top Button
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 400) {
      btn.classList.remove('opacity-0', 'pointer-events-none');
      btn.classList.add('opacity-100');
    } else {
      btn.classList.add('opacity-0', 'pointer-events-none');
      btn.classList.remove('opacity-100');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
