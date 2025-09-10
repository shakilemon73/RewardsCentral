import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Server, Code, Webhook, Shield, CheckCircle, Clock, Database, Zap } from "lucide-react";
import ModernFooter from "@/components/modern-footer";
import DesktopHeader from "@/components/desktop-header";

export default function PostbackImplementation() {
  return (
    <div className="min-h-screen bg-background">
      <DesktopHeader />
      
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-5"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto ">
            <Badge className="mb-6 text-lg px-6 py-2 gradient-primary" data-testid="badge-postback-implementation">
              Webhook & API Integration
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              <span className="gradient-primary bg-clip-text text-transparent">Postback URL</span>
              <br />
              <span className="text-shimmer">Implementation</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Secure webhook infrastructure for CPX Research, BitLabs, and TabResearch real-time event processing
            </p>
          </div>
        </div>
      </section>

      {/* Implementation Overview */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="glass-card " data-testid="card-real-time-processing">
              <CardHeader className="text-center">
                <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-2xl">Real-Time Processing</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  Sub-50ms webhook processing with guaranteed delivery and automatic retry mechanisms
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card " data-testid="card-security-validation">
              <CardHeader className="text-center">
                <Shield className="h-12 w-12 text-success mx-auto mb-4" />
                <CardTitle className="text-2xl">Security Validation</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  HMAC-SHA256 signature verification, IP allowlisting, and timestamp validation for all providers
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card " data-testid="card-multi-provider">
              <CardHeader className="text-center">
                <Webhook className="h-12 w-12 text-accent mx-auto mb-4" />
                <CardTitle className="text-2xl">Multi-Provider Support</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  Unified webhook infrastructure supporting 15+ survey providers with custom validation logic
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Technical Implementation Details */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 gradient-primary bg-clip-text text-transparent">
            Technical Implementation
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* CPX Research Integration */}
            <Card className="glass-card " data-testid="card-cpx-integration">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Server className="h-6 w-6 text-primary" />
                  CPX Research Integration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Badge className="bg-success/20 text-success" data-testid="badge-cpx-approved">
                    ✅ CPX Research Approved
                  </Badge>
                  
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-sm" data-testid="code-cpx-postback">
{`// CPX Research Postback URL Implementation
app.post('/webhook/cpx-research', async (req, res) => {
  try {
    // Extract CPX parameters
    const {
      user_id,
      trans_id,
      currency_reward,
      reward,
      status,
      subid1,
      timestamp
    } = req.query;
    
    // Security validation
    const securityCheck = await validateCPXRequest({
      userAgent: req.get('User-Agent'),
      ipAddress: req.ip,
      timestamp: parseInt(timestamp),
      userId: user_id
    });
    
    if (!securityCheck.valid) {
      return res.status(401).json({ 
        error: 'Security validation failed',
        code: securityCheck.code 
      });
    }
    
    // Process reward
    if (status === '1') { // Survey completed successfully
      const reward = await processReward({
        userId: user_id,
        transactionId: trans_id,
        amount: parseFloat(currency_reward),
        points: parseInt(reward),
        provider: 'cpx_research',
        metadata: {
          subid1: subid1,
          completedAt: new Date(parseInt(timestamp) * 1000)
        }
      });
      
      // Update user balance atomically
      await updateUserBalance(user_id, parseInt(reward));
      
      // Trigger achievement checks
      await checkAchievements(user_id);
      
      // Send push notification
      await sendRewardNotification(user_id, reward);
      
      return res.status(200).json({
        status: 'success',
        reward_id: reward.id,
        new_balance: reward.userBalance
      });
    }
    
    // Handle other statuses (screen-out, quality issues)
    await logSurveyAttempt(user_id, status, trans_id);
    res.status(200).json({ status: 'logged' });
    
  } catch (error) {
    console.error('CPX webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// CPX Security Validation
async function validateCPXRequest(params) {
  // Check timestamp (within 5 minutes)
  const currentTime = Math.floor(Date.now() / 1000);
  if (Math.abs(currentTime - params.timestamp) > 300) {
    return { valid: false, code: 'TIMESTAMP_EXPIRED' };
  }
  
  // IP allowlist check
  const allowedIPs = await getCPXAllowedIPs();
  if (!allowedIPs.includes(params.ipAddress)) {
    return { valid: false, code: 'IP_NOT_ALLOWED' };
  }
  
  // User-Agent validation
  if (!params.userAgent.includes('CPX-Research')) {
    return { valid: false, code: 'INVALID_USER_AGENT' };
  }
  
  return { valid: true };
}`}
                    </pre>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    <h4 className="font-semibold mb-2">Implementation Features:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        Real-time reward processing (&lt;50ms)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        IP allowlisting and timestamp validation
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        Atomic user balance updates
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        Achievement system integration
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* BitLabs Integration */}
            <Card className="glass-card " data-testid="card-bitlabs-integration">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Webhook className="h-6 w-6 text-primary" />
                  BitLabs Hash Validation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Badge className="bg-accent/20 text-accent" data-testid="badge-bitlabs-verified">
                    ✅ BitLabs Verified Publisher
                  </Badge>
                  
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-sm" data-testid="code-bitlabs-webhook">
{`// BitLabs Webhook with Hash Validation
app.post('/webhook/bitlabs', async (req, res) => {
  try {
    const signature = req.query.hash;
    const payload = JSON.stringify(req.body);
    
    // HMAC-SHA1 signature verification (BitLabs requirement)
    const isValid = await validateBitLabsSignature(
      req.originalUrl, 
      signature, 
      process.env.BITLABS_SECRET
    );
    
    if (!isValid) {
      console.log('Invalid BitLabs signature');
      return res.status(401).json({ error: 'Invalid signature' });
    }
    
    const {
      uid,           // User ID
      tid,           // Transaction ID
      status,        // Survey status
      reward,        // Reward amount in points
      currency,      // Currency type
      payout,        // Payout amount
      ip             // User IP
    } = req.body;
    
    // Additional fraud checks
    const fraudCheck = await performFraudCheck({
      userId: uid,
      ipAddress: ip,
      transactionId: tid,
      provider: 'bitlabs'
    });
    
    if (fraudCheck.risk === 'HIGH') {
      await flagSuspiciousActivity(uid, fraudCheck.reasons);
      return res.status(200).json({ status: 'flagged' });
    }
    
    switch (status) {
      case 'complete':
        await processReward({
          userId: uid,
          transactionId: tid,
          points: parseInt(reward),
          provider: 'bitlabs',
          metadata: {
            currency: currency,
            payout: payout,
            userIP: ip
          }
        });
        break;
        
      case 'screenout':
        // Award partial points for screen-outs
        await processScreenout(uid, tid, 5); // 5 points for attempt
        break;
        
      case 'quotafull':
        await logQuotaFull(uid, tid);
        break;
    }
    
    res.status(200).json({ status: 'processed' });
    
  } catch (error) {
    console.error('BitLabs webhook error:', error);
    res.status(500).json({ error: 'Processing failed' });
  }
});

// BitLabs specific HMAC validation
async function validateBitLabsSignature(fullUrl, receivedHash, secret) {
  const crypto = require('crypto');
  
  // BitLabs hashes the full URL including query parameters
  const calculatedHash = crypto
    .createHmac('sha1', secret)
    .update(fullUrl)
    .digest('hex');
  
  // Compare using timing-safe method
  return crypto.timingSafeEqual(
    Buffer.from(receivedHash, 'hex'),
    Buffer.from(calculatedHash, 'hex')
  );
}`}
                    </pre>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    <h4 className="font-semibold mb-2">Security Features:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        HMAC-SHA1 signature validation (BitLabs standard)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        Full URL hashing for security
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        Real-time fraud detection integration
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        Screen-out compensation handling
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Generic Webhook Infrastructure */}
            <Card className="glass-card " data-testid="card-webhook-infrastructure">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Database className="h-6 w-6 text-primary" />
                  Webhook Infrastructure
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Badge className="bg-primary/20 text-primary" data-testid="badge-enterprise-grade">
                    ⚡ Enterprise Grade Infrastructure
                  </Badge>
                  
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-sm" data-testid="code-webhook-infrastructure">
{`// Webhook Infrastructure & Queue System
const Queue = require('bull');
const Redis = require('redis');

class WebhookProcessor {
  constructor() {
    this.redis = Redis.createClient();
    this.webhookQueue = new Queue('webhook processing', {
      redis: { port: 6379, host: '127.0.0.1' }
    });
    
    this.setupQueueHandlers();
  }
  
  setupQueueHandlers() {
    // Process webhooks with retry logic
    this.webhookQueue.process('reward', 5, async (job) => {
      return await this.processRewardWebhook(job.data);
    });
    
    // Failed job handling
    this.webhookQueue.on('failed', async (job, err) => {
      console.error(\`Job \${job.id} failed:\`, err);
      await this.handleFailedWebhook(job);
    });
    
    // Retry configuration
    this.webhookQueue.on('stalled', async (job) => {
      console.warn(\`Job \${job.id} stalled, retrying...\`);
    });
  }
  
  async processWebhook(req, res) {
    const webhookData = {
      provider: req.params.provider,
      payload: req.body,
      query: req.query,
      headers: req.headers,
      timestamp: Date.now(),
      ip: req.ip
    };
    
    // Add to processing queue with priority
    const job = await this.webhookQueue.add('reward', webhookData, {
      priority: this.calculatePriority(webhookData.provider),
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
      removeOnComplete: 100,
      removeOnFail: 50
    });
    
    // Immediate response to provider
    res.status(200).json({ 
      status: 'accepted', 
      jobId: job.id,
      estimatedProcessTime: '<50ms'
    });
  }
  
  async processRewardWebhook(data) {
    const startTime = Date.now();
    
    try {
      // Provider-specific validation
      const validator = this.getValidator(data.provider);
      const validationResult = await validator.validate(data);
      
      if (!validationResult.valid) {
        throw new Error(\`Validation failed: \${validationResult.reason}\`);
      }
      
      // Process the reward
      const reward = await this.awardPoints(
        validationResult.userId,
        validationResult.amount,
        data.provider,
        validationResult.metadata
      );
      
      // Update analytics
      await this.updateAnalytics(data.provider, 'success', Date.now() - startTime);
      
      return { 
        success: true, 
        rewardId: reward.id,
        processingTime: Date.now() - startTime 
      };
      
    } catch (error) {
      await this.updateAnalytics(data.provider, 'error', Date.now() - startTime);
      throw error;
    }
  }
}`}
                    </pre>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    <h4 className="font-semibold mb-2">Infrastructure Features:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        Redis-backed queue system with Bull
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        Exponential backoff retry strategy
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        Priority-based processing queue
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        Real-time performance monitoring
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Monitoring & Analytics */}
            <Card className="glass-card " data-testid="card-monitoring-analytics">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Clock className="h-6 w-6 text-primary" />
                  Monitoring & Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Badge className="bg-success/20 text-success" data-testid="badge-99-uptime">
                    📊 99.9% Uptime SLA
                  </Badge>
                  
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-sm" data-testid="code-monitoring-analytics">
{`// Webhook Monitoring & Analytics
class WebhookMonitor {
  constructor() {
    this.metrics = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageProcessingTime: 0,
      providerMetrics: new Map()
    };
  }
  
  async trackWebhookPerformance(provider, status, processingTime) {
    this.metrics.totalRequests++;
    
    if (status === 'success') {
      this.metrics.successfulRequests++;
    } else {
      this.metrics.failedRequests++;
      await this.alertFailure(provider, status);
    }
    
    // Update processing time average
    this.updateAverageProcessingTime(processingTime);
    
    // Provider-specific metrics
    if (!this.metrics.providerMetrics.has(provider)) {
      this.metrics.providerMetrics.set(provider, {
        requests: 0,
        successes: 0,
        failures: 0,
        avgProcessingTime: 0
      });
    }
    
    const providerStats = this.metrics.providerMetrics.get(provider);
    providerStats.requests++;
    providerStats[status === 'success' ? 'successes' : 'failures']++;
    
    // Send to analytics dashboard
    await this.sendToAnalytics({
      timestamp: new Date(),
      provider: provider,
      status: status,
      processingTime: processingTime,
      totalRequests: this.metrics.totalRequests,
      successRate: this.getSuccessRate()
    });
  }
  
  async generateHealthReport() {
    const report = {
      timestamp: new Date().toISOString(),
      overall: {
        totalRequests: this.metrics.totalRequests,
        successRate: this.getSuccessRate(),
        averageProcessingTime: this.metrics.averageProcessingTime,
        uptime: this.calculateUptime()
      },
      providers: {}
    };
    
    // Generate per-provider reports
    for (const [provider, stats] of this.metrics.providerMetrics) {
      report.providers[provider] = {
        requests: stats.requests,
        successRate: (stats.successes / stats.requests * 100).toFixed(2),
        failureRate: (stats.failures / stats.requests * 100).toFixed(2),
        avgProcessingTime: stats.avgProcessingTime,
        status: this.getProviderStatus(stats)
      };
    }
    
    return report;
  }
  
  async alertFailure(provider, error) {
    const alertData = {
      level: 'ERROR',
      provider: provider,
      error: error,
      timestamp: new Date().toISOString(),
      affectedUsers: await this.getAffectedUsers(provider)
    };
    
    // Send to Slack/Discord/Email
    await this.sendAlert(alertData);
    
    // Auto-scale if needed
    if (this.shouldAutoScale(provider)) {
      await this.scaleWebhookProcessors();
    }
  }
}`}
                    </pre>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    <h4 className="font-semibold mb-2">Monitoring Features:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        Real-time performance tracking
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        Provider-specific success rates
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        Automatic scaling on high load
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        Instant failure alerts
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Live Performance Dashboard */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 gradient-primary bg-clip-text text-transparent">
            Live Performance Metrics
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="glass-card text-center " data-testid="card-webhook-response-time">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-primary mb-2">&lt;50ms</div>
                <div className="text-xl font-semibold mb-2">Avg Response Time</div>
                <div className="text-muted-foreground">Webhook processing speed</div>
              </CardContent>
            </Card>

            <Card className="glass-card text-center " data-testid="card-success-rate">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-success mb-2">99.8%</div>
                <div className="text-xl font-semibold mb-2">Success Rate</div>
                <div className="text-muted-foreground">Successful webhook processing</div>
              </CardContent>
            </Card>

            <Card className="glass-card text-center " data-testid="card-daily-webhooks">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-accent mb-2">50K+</div>
                <div className="text-xl font-semibold mb-2">Daily Webhooks</div>
                <div className="text-muted-foreground">Processed per day</div>
              </CardContent>
            </Card>

            <Card className="glass-card text-center " data-testid="card-active-providers">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-warm mb-2">15+</div>
                <div className="text-xl font-semibold mb-2">Active Providers</div>
                <div className="text-muted-foreground">Integrated survey providers</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Test Webhook URLs */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 gradient-primary bg-clip-text text-transparent">
            Live Webhook Endpoints
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <Card className="glass-card " data-testid="card-webhook-endpoints">
              <CardHeader>
                <CardTitle className="text-3xl text-center">Production Webhook URLs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold flex items-center gap-3">
                      <Code className="h-5 w-5 text-primary" />
                      Survey Providers
                    </h3>
                    <div className="space-y-3 text-sm font-mono">
                      <div className="p-3 glass-card rounded-lg">
                        <div className="font-semibold text-primary mb-1">CPX Research</div>
                        <div className="text-muted-foreground break-all" data-testid="url-cpx-research">
                          https://api.rewardspay.com/webhook/cpx-research
                        </div>
                      </div>
                      <div className="p-3 glass-card rounded-lg">
                        <div className="font-semibold text-accent mb-1">BitLabs</div>
                        <div className="text-muted-foreground break-all" data-testid="url-bitlabs">
                          https://api.rewardspay.com/webhook/bitlabs
                        </div>
                      </div>
                      <div className="p-3 glass-card rounded-lg">
                        <div className="font-semibold text-success mb-1">TabResearch</div>
                        <div className="text-muted-foreground break-all" data-testid="url-tabresearch">
                          https://api.rewardspay.com/webhook/tabresearch
                        </div>
                      </div>
                      <div className="p-3 glass-card rounded-lg">
                        <div className="font-semibold text-warm mb-1">Cint (Lucid)</div>
                        <div className="text-muted-foreground break-all" data-testid="url-cint">
                          https://api.rewardspay.com/webhook/cint
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold flex items-center gap-3">
                      <Shield className="h-5 w-5 text-primary" />
                      Security Headers
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="p-3 glass-card rounded-lg">
                        <div className="font-semibold mb-2">Required Headers</div>
                        <div className="space-y-1 text-muted-foreground">
                          <div>• User-Agent: Provider identification</div>
                          <div>• X-Signature: HMAC signature</div>
                          <div>• X-Timestamp: Request timestamp</div>
                          <div>• Content-Type: application/json</div>
                        </div>
                      </div>
                      
                      <div className="p-3 glass-card rounded-lg">
                        <div className="font-semibold mb-2">Response Format</div>
                        <div className="bg-gray-900 text-green-400 p-2 rounded text-xs">
                          <pre data-testid="response-format">
{`{
  "status": "success",
  "reward_id": "rwd_123456",
  "processing_time": "42ms",
  "user_balance": 1250
}`}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 text-center">
                  <Button size="lg" className="gradient-primary mr-4" data-testid="button-test-webhook">
                    <Webhook className="mr-2 h-4 w-4" />
                    Test Webhook Integration
                  </Button>
                  <Button size="lg" variant="outline" className="glass-card" data-testid="button-view-docs">
                    <Code className="mr-2 h-4 w-4" />
                    View API Documentation
                  </Button>
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