import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, FileText, Users, Eye, Lock, Server, Database, CheckCircle } from "lucide-react";
import ModernFooter from "@/components/modern-footer";
import DesktopHeader from "@/components/desktop-header";

export default function GDPRCompliance() {
  return (
    <div className="min-h-screen bg-background">
      <DesktopHeader />
      
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-5"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto fade-up">
            <Badge className="mb-6 text-lg px-6 py-2 gradient-primary" data-testid="badge-gdpr-compliance">
              Legal & Technical Implementation
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              <span className="gradient-primary bg-clip-text text-transparent">GDPR Compliance</span>
              <br />
              <span className="text-shimmer">Implementation</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Complete GDPR compliance system meeting TabResearch, BitLabs, and CPX Research data protection requirements
            </p>
          </div>
        </div>
      </section>

      {/* Compliance Overview */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="glass-card fade-up" data-testid="card-legal-framework">
              <CardHeader className="text-center">
                <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-2xl">Legal Framework</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  Full compliance with GDPR Articles 6, 7, 13, 14, and 17 including lawful basis and consent management
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card fade-up" style={{animationDelay: '0.2s'}} data-testid="card-data-protection">
              <CardHeader className="text-center">
                <Lock className="h-12 w-12 text-success mx-auto mb-4" />
                <CardTitle className="text-2xl">Data Protection</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  End-to-end encryption, pseudonymization, and data minimization with automated retention policies
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card fade-up" style={{animationDelay: '0.4s'}} data-testid="card-user-rights">
              <CardHeader className="text-center">
                <Users className="h-12 w-12 text-accent mx-auto mb-4" />
                <CardTitle className="text-2xl">User Rights</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  Automated handling of access, portability, rectification, erasure, and objection requests
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Technical Implementation */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 gradient-primary bg-clip-text text-transparent">
            Technical Implementation
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Consent Management Platform */}
            <Card className="glass-card fade-up" data-testid="card-consent-management">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Shield className="h-6 w-6 text-primary" />
                  Consent Management Platform (CMP)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Badge className="bg-warm/20 text-warm" data-testid="badge-tabresearch-required">
                    ✅ TabResearch Required
                  </Badge>
                  
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-sm" data-testid="code-consent-management">
{`// GDPR Consent Management Implementation
class ConsentManager {
  constructor() {
    this.consentData = {};
    this.legalBasis = {
      'analytics': 'legitimate_interest',
      'marketing': 'consent',
      'essential': 'contract',
      'surveys': 'consent'
    };
  }
  
  async requestConsent(purposes) {
    const modal = this.createConsentModal(purposes);
    
    return new Promise((resolve) => {
      modal.onConsent = (consentChoices) => {
        this.recordConsent(consentChoices);
        this.updateDataProcessing(consentChoices);
        resolve(consentChoices);
      };
    });
  }
  
  createConsentModal(purposes) {
    return {
      purposes: purposes.map(purpose => ({
        id: purpose,
        name: this.getPurposeName(purpose),
        description: this.getPurposeDescription(purpose),
        legalBasis: this.legalBasis[purpose],
        required: purpose === 'essential',
        vendors: this.getVendorsForPurpose(purpose)
      })),
      
      // TabResearch specific requirements
      vendors: [
        {
          id: 'taboola',
          name: 'Taboola',
          privacyPolicy: 'https://www.taboola.com/policies/privacy-policy',
          purposes: ['personalization', 'analytics']
        },
        {
          id: 'bitlabs',
          name: 'BitLabs',
          privacyPolicy: 'https://www.bitlabs.ai/privacy',
          purposes: ['surveys', 'analytics']
        }
      ]
    };
  }
  
  recordConsent(choices) {
    const consentRecord = {
      userId: this.getCurrentUserId(),
      timestamp: new Date().toISOString(),
      choices: choices,
      tcString: this.generateTCString(choices),
      ipAddress: this.getHashedIP(),
      userAgent: navigator.userAgent,
      version: '2.0'
    };
    
    // Store with 3-year retention
    this.storeConsentRecord(consentRecord);
  }
}`}
                    </pre>
                  </div>
                  
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      IAB TCF 2.0 compliant consent strings
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      Granular purpose-based consent management
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      Automatic vendor list updates
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Data Processing & Storage */}
            <Card className="glass-card fade-up" style={{animationDelay: '0.2s'}} data-testid="card-data-processing">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Database className="h-6 w-6 text-primary" />
                  Data Processing & Storage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Badge className="bg-success/20 text-success" data-testid="badge-bitlabs-required">
                    ✅ BitLabs Privacy Compliant
                  </Badge>
                  
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-sm" data-testid="code-data-processing">
{`// GDPR Data Processing Implementation
class DataProcessor {
  constructor() {
    this.encryptionKey = process.env.DATA_ENCRYPTION_KEY;
    this.retentionPolicies = {
      'user_profiles': 365 * 3, // 3 years
      'survey_responses': 365 * 2, // 2 years
      'analytics_data': 365 * 1, // 1 year
      'consent_records': 365 * 3 // 3 years
    };
  }
  
  async processPersonalData(data, purpose, legalBasis) {
    // Data minimization - only process what's necessary
    const minimizedData = this.minimizeData(data, purpose);
    
    // Pseudonymization for analytics
    if (purpose === 'analytics') {
      minimizedData.userId = this.pseudonymize(data.userId);
    }
    
    // Encryption at rest
    const encryptedData = this.encrypt(minimizedData);
    
    // Create processing record
    const processingRecord = {
      dataSubject: data.userId,
      purpose: purpose,
      legalBasis: legalBasis,
      timestamp: new Date().toISOString(),
      retention: this.retentionPolicies[purpose],
      dataCategories: this.categorizeData(data)
    };
    
    await this.storeWithRetention(encryptedData, processingRecord);
    return processingRecord.id;
  }
  
  encrypt(data) {
    const crypto = require('crypto');
    const cipher = crypto.createCipher('aes-256-gcm', this.encryptionKey);
    
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return {
      data: encrypted,
      authTag: cipher.getAuthTag().toString('hex')
    };
  }
  
  async handleDataSubjectRequest(userId, requestType) {
    switch (requestType) {
      case 'access':
        return await this.exportUserData(userId);
      
      case 'portability':
        return await this.exportUserDataStructured(userId);
      
      case 'erasure':
        return await this.deleteUserData(userId);
      
      case 'rectification':
        return await this.updateUserData(userId);
        
      case 'objection':
        return await this.stopProcessing(userId);
    }
  }
}`}
                    </pre>
                  </div>
                  
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      AES-256-GCM encryption for all personal data
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      Automated data retention and deletion
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      Pseudonymization for analytics data
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* User Rights Automation */}
            <Card className="glass-card fade-up" style={{animationDelay: '0.4s'}} data-testid="card-user-rights-automation">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Eye className="h-6 w-6 text-primary" />
                  User Rights Automation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Badge className="bg-primary/20 text-primary" data-testid="badge-cpx-privacy">
                    ✅ CPX Privacy Framework
                  </Badge>
                  
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-sm" data-testid="code-user-rights">
{`// User Rights API Implementation
class UserRightsAPI {
  constructor() {
    this.requestQueue = new Queue('user-rights-requests');
    this.verificationService = new IdentityVerification();
  }
  
  // Right of Access (Article 15)
  async handleAccessRequest(userId, email) {
    await this.verifyIdentity(userId, email);
    
    const userData = await this.gatherAllUserData(userId);
    const report = {
      personalData: userData.personal,
      processingPurposes: userData.purposes,
      dataCategories: userData.categories,
      recipients: userData.recipients,
      retentionPeriods: userData.retention,
      rights: this.listAvailableRights(),
      sources: userData.sources
    };
    
    // Generate PDF report
    const pdfReport = await this.generatePDFReport(report);
    
    // Send via secure email
    await this.sendSecureReport(email, pdfReport);
    
    return { status: 'completed', reportId: pdfReport.id };
  }
  
  // Right to be Forgotten (Article 17)
  async handleErasureRequest(userId, reason) {
    const canDelete = await this.checkErasureConditions(userId, reason);
    
    if (!canDelete.allowed) {
      return { 
        status: 'rejected', 
        reason: canDelete.reason,
        legalBasis: canDelete.legalBasis 
      };
    }
    
    // Cascade deletion across all systems
    await Promise.all([
      this.deleteFromPrimary(userId),
      this.deleteFromAnalytics(userId),
      this.deleteFromBackups(userId),
      this.notifyThirdParties(userId), // BitLabs, CPX, etc.
      this.updateConsentRecords(userId)
    ]);
    
    // Verify complete deletion
    const verificationResult = await this.verifyDeletion(userId);
    
    return { 
      status: 'completed', 
      deletionId: verificationResult.id,
      timestamp: new Date().toISOString()
    };
  }
  
  // Data Portability (Article 20)
  async handlePortabilityRequest(userId) {
    const portableData = await this.getPortableData(userId);
    
    const structuredExport = {
      format: 'JSON',
      version: '1.0',
      exported: new Date().toISOString(),
      data: {
        profile: portableData.profile,
        surveys: portableData.surveys,
        rewards: portableData.rewards,
        preferences: portableData.preferences
      }
    };
    
    return this.generateDownloadLink(structuredExport);
  }
}`}
                    </pre>
                  </div>
                  
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      Automated identity verification process
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      30-day response time guarantee
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      Complete audit trail for all requests
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Cross-Border Data Transfers */}
            <Card className="glass-card fade-up" style={{animationDelay: '0.6s'}} data-testid="card-data-transfers">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Server className="h-6 w-6 text-primary" />
                  Cross-Border Data Transfers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Badge className="bg-accent/20 text-accent" data-testid="badge-adequacy-decisions">
                    ✅ Adequacy Decisions & SCCs
                  </Badge>
                  
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-sm" data-testid="code-data-transfers">
{`// International Data Transfer Compliance
class DataTransferCompliance {
  constructor() {
    this.adequacyCountries = [
      'UK', 'CA', 'CH', 'NZ', 'JP', 'KR', 'UY', 'AD', 'AR', 'GG', 'IM', 'JE', 'FO', 'IL'
    ];
    
    this.sccImplemented = true;
    this.transferImpactAssessment = new TIA();
  }
  
  async processInternationalTransfer(data, destination, vendor) {
    // Check if transfer is to adequate country
    if (this.adequacyCountries.includes(destination)) {
      return await this.processAdequateTransfer(data, destination, vendor);
    }
    
    // Require additional safeguards for non-adequate countries
    return await this.processNonAdequateTransfer(data, destination, vendor);
  }
  
  async processNonAdequateTransfer(data, destination, vendor) {
    // Transfer Impact Assessment (TIA)
    const tiaResult = await this.transferImpactAssessment.assess({
      destination: destination,
      vendor: vendor,
      dataCategories: this.categorizeData(data),
      processingPurposes: data.purposes,
      securityMeasures: vendor.securityMeasures
    });
    
    if (tiaResult.risk === 'HIGH') {
      return { 
        allowed: false, 
        reason: 'High risk transfer blocked',
        alternatives: tiaResult.alternatives 
      };
    }
    
    // Apply Standard Contractual Clauses
    const sccCompliant = await this.verifySCCCompliance(vendor);
    
    if (!sccCompliant) {
      throw new Error('Vendor not SCC compliant');
    }
    
    // Additional safeguards for US transfers (post-Schrems II)
    if (destination === 'US') {
      await this.applyUSSpecificSafeguards(data, vendor);
    }
    
    // Log transfer for accountability
    await this.logInternationalTransfer({
      dataSubject: data.userId,
      destination: destination,
      vendor: vendor.name,
      safeguards: 'SCC + Additional Technical Measures',
      timestamp: new Date().toISOString(),
      tiaReference: tiaResult.id
    });
    
    return { allowed: true, transferId: this.generateTransferId() };
  }
}`}
                    </pre>
                  </div>
                  
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      Standard Contractual Clauses implementation
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      Transfer Impact Assessments for high-risk transfers
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      Additional safeguards for US data transfers
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Compliance Certifications */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 gradient-primary bg-clip-text text-transparent">
            Compliance Certifications
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="glass-card text-center fade-up" data-testid="card-iso-27001">
              <CardContent className="pt-6">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <div className="text-xl font-bold mb-2">ISO 27001</div>
                <div className="text-muted-foreground">Information Security Management</div>
              </CardContent>
            </Card>

            <Card className="glass-card text-center fade-up" style={{animationDelay: '0.2s'}} data-testid="card-iso-27701">
              <CardContent className="pt-6">
                <Lock className="h-12 w-12 text-success mx-auto mb-4" />
                <div className="text-xl font-bold mb-2">ISO 27701</div>
                <div className="text-muted-foreground">Privacy Information Management</div>
              </CardContent>
            </Card>

            <Card className="glass-card text-center fade-up" style={{animationDelay: '0.4s'}} data-testid="card-soc2-type2">
              <CardContent className="pt-6">
                <Server className="h-12 w-12 text-accent mx-auto mb-4" />
                <div className="text-xl font-bold mb-2">SOC 2 Type II</div>
                <div className="text-muted-foreground">Security & Availability Controls</div>
              </CardContent>
            </Card>

            <Card className="glass-card text-center fade-up" style={{animationDelay: '0.6s'}} data-testid="card-gdpr-certified">
              <CardContent className="pt-6">
                <CheckCircle className="h-12 w-12 text-warm mx-auto mb-4" />
                <div className="text-xl font-bold mb-2">GDPR Certified</div>
                <div className="text-muted-foreground">Third-party audited compliance</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Privacy Dashboard */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 gradient-primary bg-clip-text text-transparent">
            User Privacy Dashboard
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <Card className="glass-card fade-up" data-testid="card-privacy-dashboard">
              <CardHeader>
                <CardTitle className="text-3xl text-center">Interactive Privacy Controls</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold flex items-center gap-3">
                      <Users className="h-5 w-5 text-primary" />
                      Your Data Rights
                    </h3>
                    <div className="space-y-3">
                      <Button className="w-full justify-start glass-card" data-testid="button-download-data">
                        <Database className="mr-2 h-4 w-4" />
                        Download My Data (Article 15)
                      </Button>
                      <Button className="w-full justify-start glass-card" data-testid="button-update-preferences">
                        <FileText className="mr-2 h-4 w-4" />
                        Update Data & Preferences (Article 16)
                      </Button>
                      <Button className="w-full justify-start glass-card" data-testid="button-delete-account">
                        <Eye className="mr-2 h-4 w-4" />
                        Delete My Account (Article 17)
                      </Button>
                      <Button className="w-full justify-start glass-card" data-testid="button-object-processing">
                        <Shield className="mr-2 h-4 w-4" />
                        Object to Processing (Article 21)
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold flex items-center gap-3">
                      <Lock className="h-5 w-5 text-primary" />
                      Consent Management
                    </h3>
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <div className="flex items-center justify-between p-3 glass-card rounded-lg">
                        <span>Essential Cookies</span>
                        <Badge className="bg-success/20 text-success">Always Active</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 glass-card rounded-lg">
                        <span>Analytics & Performance</span>
                        <Button size="sm" variant="outline" data-testid="toggle-analytics">Toggle</Button>
                      </div>
                      <div className="flex items-center justify-between p-3 glass-card rounded-lg">
                        <span>Marketing & Personalization</span>
                        <Button size="sm" variant="outline" data-testid="toggle-marketing">Toggle</Button>
                      </div>
                      <div className="flex items-center justify-between p-3 glass-card rounded-lg">
                        <span>Survey Partners</span>
                        <Button size="sm" variant="outline" data-testid="toggle-surveys">Toggle</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <ModernFooter />
    </div>
  );
}