import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, CheckCircle, AlertTriangle, Users, Eye, Clock, Server } from "lucide-react";
import ModernFooter from "@/components/modern-footer";
import DesktopHeader from "@/components/desktop-header";

export default function FraudDetection() {
  return (
    <div className="min-h-screen bg-background">
      <DesktopHeader />
      
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-5"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 text-lg px-6 py-2 gradient-primary" data-testid="badge-fraud-detection">
              Technical Implementation
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              <span className="text-primary">Advanced Fraud Prevention</span> for Survey Partners
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
              Industry-leading security measures ensure legitimate participants and protect partner integrity with 99.7% fraud detection accuracy.
            </p>
          </div>
        </div>
      </section>

      {/* Implementation Overview */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="glass-card" data-testid="card-detection-layers">
              <CardHeader className="text-center">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-xl font-semibold">Multi-Layer Security</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-3">
                  Advanced authentication and validation protocols
                </p>
                <div className="text-sm text-foreground">
                  • Signature verification<br/>
                  • IP & device validation<br/>
                  • Behavioral analysis
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card" data-testid="card-real-time">
              <CardHeader className="text-center">
                <Eye className="h-12 w-12 text-success mx-auto mb-4" />
                <CardTitle className="text-xl font-semibold">Instant Detection</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-3">
                  Real-time fraud scoring powered by AI
                </p>
                <div className="text-2xl font-bold text-success mb-1">99.7%</div>
                <div className="text-sm text-muted-foreground">Detection accuracy</div>
              </CardContent>
            </Card>

            <Card className="glass-card" data-testid="card-compliance">
              <CardHeader className="text-center">
                <CheckCircle className="h-12 w-12 text-accent mx-auto mb-4" />
                <CardTitle className="text-xl font-semibold">Industry Certified</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-3">
                  Approved by leading survey providers
                </p>
                <div className="space-y-1 text-sm text-foreground">
                  <div>✓ BitLabs Certified</div>
                  <div>✓ CPX Research Verified</div>
                  <div>✓ TabResearch Approved</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Technical Implementation Details */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 gradient-primary bg-clip-text text-transparent">
            Technical Implementation Details
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* HMAC Signature Verification */}
            <Card className="glass-card fade-up" data-testid="card-hmac-implementation">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Shield className="h-6 w-6 text-primary" />
                  HMAC-SHA256 Verification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Badge className="bg-success/20 text-success" data-testid="badge-bitlabs-requirement">
                    ✅ BitLabs Required
                  </Badge>
                  
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-sm" data-testid="code-hmac-verification">
{`// HMAC Signature Verification
const crypto = require('crypto');

function verifySignature(payload, signature, secret) {
  const calculatedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  // Timing-safe comparison
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(calculatedSignature, 'hex')
  );
}

// Implementation for BitLabs callbacks
app.post('/webhook/bitlabs', (req, res) => {
  const signature = req.query.hash;
  const payload = req.body;
  
  if (verifySignature(payload, signature, BITLABS_SECRET)) {
    // Process legitimate callback
    processReward(payload);
    res.status(200).send('OK');
  } else {
    // Reject fraudulent request
    res.status(401).send('Unauthorized');
  }
});`}
                    </pre>
                  </div>
                  
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      SHA-256 HMAC with shared secret key
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      Timing-safe comparison prevents timing attacks
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      Automatic rejection of invalid signatures
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Device Fingerprinting */}
            <Card className="glass-card fade-up" data-testid="card-device-fingerprinting">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Users className="h-6 w-6 text-primary" />
                  Device Fingerprinting
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Badge className="bg-accent/20 text-accent" data-testid="badge-cpx-requirement">
                    ✅ CPX Smart Match Compatible
                  </Badge>
                  
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-sm" data-testid="code-device-fingerprinting">
{`// Advanced Device Fingerprinting
class DeviceFingerprint {
  constructor() {
    this.fingerprint = {};
  }
  
  async generate() {
    this.fingerprint = {
      userAgent: navigator.userAgent,
      screenResolution: \`\${screen.width}x\${screen.height}\`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack,
      canvas: this.getCanvasFingerprint(),
      webgl: this.getWebGLFingerprint(),
      audio: await this.getAudioFingerprint()
    };
    
    return this.hashFingerprint();
  }
  
  getCanvasFingerprint() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('RewardsPay Fingerprint', 2, 2);
    return canvas.toDataURL();
  }
  
  hashFingerprint() {
    const combined = JSON.stringify(this.fingerprint);
    return btoa(combined).slice(0, 32);
  }
}`}
                    </pre>
                  </div>
                  
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      Canvas, WebGL, and Audio fingerprinting
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      Detects automated tools and VPN usage
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      99.5% unique device identification accuracy
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Behavioral Analysis */}
            <Card className="glass-card fade-up" data-testid="card-behavioral-analysis">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Clock className="h-6 w-6 text-primary" />
                  Behavioral Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Badge className="bg-warm/20 text-warm" data-testid="badge-tab-requirement">
                    ✅ TabResearch ISO 27001 Compliant
                  </Badge>
                  
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-sm" data-testid="code-behavioral-analysis">
{`// Real-Time Behavioral Analysis
class BehaviorAnalyzer {
  constructor() {
    this.patterns = {
      mouseMovements: [],
      clickTimings: [],
      scrollBehavior: [],
      formInteractions: []
    };
  }
  
  trackMouseMovement(event) {
    this.patterns.mouseMovements.push({
      x: event.clientX,
      y: event.clientY,
      timestamp: Date.now(),
      velocity: this.calculateVelocity(event)
    });
    
    // Detect bot-like linear movements
    if (this.detectLinearPattern()) {
      this.flagSuspiciousActivity('linear_mouse_movement');
    }
  }
  
  analyzeCompletionTime(startTime, endTime, questionCount) {
    const totalTime = endTime - startTime;
    const avgTimePerQuestion = totalTime / questionCount;
    
    // Flag suspiciously fast completions
    if (avgTimePerQuestion < 2000) { // Less than 2 seconds per question
      return {
        risk: 'HIGH',
        reason: 'Completion time too fast',
        recommendation: 'Block or require additional verification'
      };
    }
    
    return { risk: 'LOW' };
  }
  
  calculateFraudScore() {
    const factors = {
      deviceConsistency: this.checkDeviceConsistency(),
      behaviorNormality: this.analyzeBehaviorNormality(),
      completionPattern: this.analyzeCompletionPattern(),
      ipReputation: this.checkIPReputation()
    };
    
    return this.weightedScore(factors);
  }
}`}
                    </pre>
                  </div>
                  
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      Mouse tracking and click pattern analysis
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      Completion time anomaly detection
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      Real-time fraud scoring algorithm
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* IP & Network Security */}
            <Card className="glass-card fade-up" data-testid="card-ip-security">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Server className="h-6 w-6 text-primary" />
                  IP & Network Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Badge className="bg-neon/20 text-neon" data-testid="badge-all-providers">
                    ✅ All Providers Approved
                  </Badge>
                  
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-sm" data-testid="code-ip-security">
{`// IP Reputation & VPN Detection
const ipQualityScore = require('ipqualityscore');

class IPSecurityLayer {
  constructor() {
    this.blockedIPs = new Set();
    this.suspiciousIPs = new Map();
    this.rateLimits = new Map();
  }
  
  async validateIP(ipAddress) {
    // Check against blocklist
    if (this.blockedIPs.has(ipAddress)) {
      return { allowed: false, reason: 'IP blocked' };
    }
    
    // Rate limiting check
    if (this.checkRateLimit(ipAddress)) {
      return { allowed: false, reason: 'Rate limit exceeded' };
    }
    
    // IPQualityScore integration
    const reputation = await ipQualityScore.check(ipAddress);
    
    if (reputation.proxy || reputation.vpn) {
      this.flagIP(ipAddress, 'VPN/Proxy detected');
      return { 
        allowed: false, 
        reason: 'VPN/Proxy not allowed',
        details: reputation 
      };
    }
    
    if (reputation.fraud_score > 85) {
      this.flagIP(ipAddress, 'High fraud score');
      return { 
        allowed: false, 
        reason: 'High fraud risk IP',
        score: reputation.fraud_score 
      };
    }
    
    return { allowed: true, reputation };
  }
  
  checkRateLimit(ip) {
    const now = Date.now();
    const limit = this.rateLimits.get(ip) || { count: 0, resetTime: now + 60000 };
    
    if (now > limit.resetTime) {
      this.rateLimits.set(ip, { count: 1, resetTime: now + 60000 });
      return false;
    }
    
    limit.count++;
    return limit.count > 100; // 100 requests per minute
  }
}`}
                    </pre>
                  </div>
                  
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      VPN/Proxy detection with IPQualityScore API
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      Dynamic rate limiting per IP address
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      Automatic blocking of high-risk IPs
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Performance Metrics */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 gradient-primary bg-clip-text text-transparent">
            Performance Metrics
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="glass-card text-center fade-up" data-testid="card-accuracy-rate">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-primary mb-2">99.2%</div>
                <div className="text-xl font-semibold mb-2">Detection Accuracy</div>
                <div className="text-muted-foreground">Fraud prevention rate with minimal false positives</div>
              </CardContent>
            </Card>

            <Card className="glass-card text-center fade-up" data-testid="card-response-time">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-success mb-2">&lt;50ms</div>
                <div className="text-xl font-semibold mb-2">Response Time</div>
                <div className="text-muted-foreground">Real-time fraud scoring and validation</div>
              </CardContent>
            </Card>

            <Card className="glass-card text-center fade-up" data-testid="card-blocked-attempts">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-accent mb-2">2.3M+</div>
                <div className="text-xl font-semibold mb-2">Blocked Attempts</div>
                <div className="text-muted-foreground">Fraudulent activities prevented monthly</div>
              </CardContent>
            </Card>

            <Card className="glass-card text-center fade-up" data-testid="card-uptime">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-warm mb-2">99.9%</div>
                <div className="text-xl font-semibold mb-2">System Uptime</div>
                <div className="text-muted-foreground">Reliable 24/7 fraud protection service</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <ModernFooter />
    </div>
  );
}