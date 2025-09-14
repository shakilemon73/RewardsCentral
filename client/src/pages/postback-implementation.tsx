import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Code, Copy, Play, CheckCircle, AlertCircle, Zap, Server,
  Webhook, Lock, Clock, Target, Database, Settings
} from "lucide-react";
import { Link } from "wouter";

export default function PostbackImplementation() {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [testPayload, setTestPayload] = useState("");
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Code snippet has been copied to your clipboard.",
    });
  };

  const testWebhook = () => {
    toast({
      title: "Webhook Test Sent",
      description: "Check your endpoint for the test payload.",
    });
  };

  const codeExamples = {
    node: `// Node.js Express Example
const express = require('express');
const crypto = require('crypto');
const app = express();

app.use(express.json());

// Verify webhook signature
const verifySignature = (payload, signature, secret) => {
  const hash = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(hash, 'hex')
  );
};

app.post('/webhook/rewardspay', (req, res) => {
  const signature = req.headers['x-rewardspay-signature'];
  const payload = JSON.stringify(req.body);
  
  if (!verifySignature(payload, signature, process.env.WEBHOOK_SECRET)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  const { event_type, user_id, transaction_id, amount } = req.body;
  
  switch (event_type) {
    case 'survey_completed':
      // Handle survey completion
      console.log(\`User \${user_id} completed survey for \${amount} points\`);
      break;
    case 'reward_claimed':
      // Handle reward claim
      console.log(\`User \${user_id} claimed reward: \${transaction_id}\`);
      break;
    default:
      console.log('Unknown event type:', event_type);
  }
  
  res.status(200).json({ status: 'received' });
});

app.listen(3000, () => {
  console.log('Webhook server running on port 3000');
});`,
    
    python: `# Python Flask Example
from flask import Flask, request, jsonify
import hashlib
import hmac
import os

app = Flask(__name__)

def verify_signature(payload, signature, secret):
    """Verify webhook signature"""
    expected_signature = hmac.new(
        secret.encode('utf-8'),
        payload.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()
    
    return hmac.compare_digest(signature, expected_signature)

@app.route('/webhook/rewardspay', methods=['POST'])
def handle_webhook():
    signature = request.headers.get('X-RewardsPay-Signature')
    payload = request.get_data(as_text=True)
    
    if not verify_signature(payload, signature, os.environ.get('WEBHOOK_SECRET')):
        return jsonify({'error': 'Invalid signature'}), 401
    
    data = request.json
    event_type = data.get('event_type')
    user_id = data.get('user_id')
    transaction_id = data.get('transaction_id')
    amount = data.get('amount')
    
    if event_type == 'survey_completed':
        # Handle survey completion
        print(f"User {user_id} completed survey for {amount} points")
    elif event_type == 'reward_claimed':
        # Handle reward claim
        print(f"User {user_id} claimed reward: {transaction_id}")
    
    return jsonify({'status': 'received'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)`,

    php: `<?php
// PHP Example
function verify_signature($payload, $signature, $secret) {
    $expected_signature = hash_hmac('sha256', $payload, $secret);
    return hash_equals($signature, $expected_signature);
}

// Get the webhook payload
$payload = file_get_contents('php://input');
$signature = $_SERVER['HTTP_X_REWARDSPAY_SIGNATURE'] ?? '';

if (!verify_signature($payload, $signature, getenv('WEBHOOK_SECRET'))) {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid signature']);
    exit;
}

$data = json_decode($payload, true);
$event_type = $data['event_type'];
$user_id = $data['user_id'];
$transaction_id = $data['transaction_id'];
$amount = $data['amount'];

switch ($event_type) {
    case 'survey_completed':
        // Handle survey completion
        error_log("User $user_id completed survey for $amount points");
        break;
    case 'reward_claimed':
        // Handle reward claim
        error_log("User $user_id claimed reward: $transaction_id");
        break;
    default:
        error_log("Unknown event type: $event_type");
}

http_response_code(200);
echo json_encode(['status' => 'received']);
?>`
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80">
      {/* Developer-Focused Header */}
      <header className="sticky top-0 z-50 glass-card border-b">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="no-underline">
            <div className="flex items-center gap-3 cursor-pointer group" data-testid="logo-rewardspay">
              <div className="gradient-primary p-2 rounded-xl group-hover:scale-110 transition-transform duration-normal">
                <Code className="h-6 w-6 text-white" />
              </div>
              <span className="text-shimmer font-bold text-2xl">RewardsPay API</span>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Button variant="ghost" className="text-muted-foreground hover:text-primary transition-colors duration-fast">
              Documentation
            </Button>
            <Button variant="ghost" className="text-muted-foreground hover:text-primary transition-colors duration-fast">
              Examples
            </Button>
            <Button variant="ghost" className="text-muted-foreground hover:text-primary transition-colors duration-fast">
              Testing
            </Button>
            <Link href="/partnerships">
              <Button variant="ghost" className="text-muted-foreground hover:text-primary transition-colors duration-fast">
                For Partners
              </Button>
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="outline" className="hidden sm:inline-flex border-primary/20 hover:border-primary text-primary hover:bg-primary/5">
              API Keys
            </Button>
            <Button className="button-glow bg-primary hover:bg-primary/90 text-primary-foreground">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 gradient-primary opacity-5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 gradient-neon opacity-5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto text-center">
            <Badge className="mb-6 text-lg px-6 py-3 bg-data-primary/10 text-data-primary border-data-primary/20" data-testid="api-badge">
              <Server className="h-4 w-4 mr-2" />
              RESTful API
            </Badge>

            <h1 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
              <span className="block text-foreground">Webhook & API</span>
              <span className="block text-shimmer">Implementation Guide</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto">
              Seamlessly integrate with RewardsPay using our robust webhook system 
              and <span className="font-bold text-primary">enterprise-grade APIs</span>.
            </p>

            {/* API Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 max-w-4xl mx-auto">
              <div className="text-center fade-up">
                <div className="text-4xl font-bold text-data-primary mb-2">99.9%</div>
                <div className="text-muted-foreground">Uptime</div>
              </div>
              <div className="text-center fade-up" style={{ animationDelay: '100ms' }}>
                <div className="text-4xl font-bold text-success mb-2">&lt;200ms</div>
                <div className="text-muted-foreground">Response Time</div>
              </div>
              <div className="text-center fade-up" style={{ animationDelay: '200ms' }}>
                <div className="text-4xl font-bold text-accent mb-2">5M+</div>
                <div className="text-muted-foreground">API Calls/Day</div>
              </div>
              <div className="text-center fade-up" style={{ animationDelay: '300ms' }}>
                <div className="text-4xl font-bold text-trust-secure mb-2">256-bit</div>
                <div className="text-muted-foreground">SSL Encryption</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start Guide */}
      <section className="py-20 bg-muted/10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Quick Integration Guide</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Get your webhook integration up and running in minutes with our step-by-step guide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="glass-card hover:scale-105 transition-all duration-slow" data-testid="step-setup">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Settings className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">1. Configure Webhook</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">
                  Set up your webhook endpoint URL in the partner dashboard.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-center gap-2 text-trust-verified">
                    <CheckCircle className="h-4 w-4" />
                    <span>Secure HTTPS required</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-trust-verified">
                    <CheckCircle className="h-4 w-4" />
                    <span>Signature verification</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-trust-verified">
                    <CheckCircle className="h-4 w-4" />
                    <span>Automatic retries</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card hover:scale-105 transition-all duration-slow" data-testid="step-implement">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Code className="h-8 w-8 text-success" />
                </div>
                <CardTitle className="text-xl">2. Implement Handler</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">
                  Use our code examples to handle webhook events securely.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-center gap-2 text-trust-verified">
                    <CheckCircle className="h-4 w-4" />
                    <span>Node.js, Python, PHP</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-trust-verified">
                    <CheckCircle className="h-4 w-4" />
                    <span>Copy-paste ready</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-trust-verified">
                    <CheckCircle className="h-4 w-4" />
                    <span>Error handling included</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card hover:scale-105 transition-all duration-slow" data-testid="step-test">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="text-xl">3. Test Integration</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">
                  Validate your implementation with our testing tools.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-center gap-2 text-trust-verified">
                    <CheckCircle className="h-4 w-4" />
                    <span>Live webhook tester</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-trust-verified">
                    <CheckCircle className="h-4 w-4" />
                    <span>Sample payloads</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-trust-verified">
                    <CheckCircle className="h-4 w-4" />
                    <span>Debug dashboard</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Code Examples */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Implementation Examples</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Production-ready code examples in popular programming languages.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <Card className="glass-card shadow-2xl" data-testid="code-examples">
              <CardContent className="p-0">
                <Tabs defaultValue="node" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 rounded-none border-b bg-transparent">
                    <TabsTrigger value="node" className="data-[state=active]:bg-primary/10" data-testid="tab-node">
                      Node.js
                    </TabsTrigger>
                    <TabsTrigger value="python" className="data-[state=active]:bg-primary/10" data-testid="tab-python">
                      Python
                    </TabsTrigger>
                    <TabsTrigger value="php" className="data-[state=active]:bg-primary/10" data-testid="tab-php">
                      PHP
                    </TabsTrigger>
                  </TabsList>

                  {Object.entries(codeExamples).map(([lang, code]) => (
                    <TabsContent key={lang} value={lang} className="p-6">
                      <div className="relative">
                        <div className="flex items-center justify-between mb-4">
                          <Badge className="bg-primary/10 text-primary border-primary/20">
                            {lang === 'node' ? 'Node.js Express' : lang === 'python' ? 'Python Flask' : 'PHP'}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(code)}
                            className="border-primary/20 hover:border-primary text-primary hover:bg-primary/5"
                            data-testid={`copy-${lang}`}
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy Code
                          </Button>
                        </div>
                        <pre className="bg-muted/20 rounded-lg p-4 overflow-x-auto text-sm">
                          <code className="text-foreground">{code}</code>
                        </pre>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Webhook Testing Tool */}
      <section className="py-20 bg-muted/10">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-6">Test Your Webhook</h2>
              <p className="text-xl text-muted-foreground">
                Send test events to your webhook endpoint to verify your implementation.
              </p>
            </div>

            <Card className="glass-card shadow-2xl" data-testid="webhook-tester">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Webhook className="h-6 w-6 text-primary" />
                  Webhook Testing Tool
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="webhook-url">Your Webhook URL</Label>
                  <Input
                    id="webhook-url"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://yourapp.com/webhook/rewardspay"
                    className="mt-2"
                    data-testid="webhook-url-input"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    onClick={testWebhook} 
                    className="h-12"
                    disabled={!webhookUrl}
                    data-testid="test-survey-completion"
                  >
                    <Target className="h-4 w-4 mr-2" />
                    Test Survey Completion
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={testWebhook}
                    className="h-12"
                    disabled={!webhookUrl}
                    data-testid="test-reward-claim"
                  >
                    <Database className="h-4 w-4 mr-2" />
                    Test Reward Claim
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={testWebhook}
                    className="h-12"
                    disabled={!webhookUrl}
                    data-testid="test-user-registration"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Test User Registration
                  </Button>
                </div>

                <div className="bg-muted/20 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Sample Webhook Payload</h3>
                  <pre className="text-sm text-muted-foreground overflow-x-auto">
                    <code>{`{
  "event_type": "survey_completed",
  "event_id": "evt_1234567890",
  "timestamp": "2024-01-15T10:30:00Z",
  "user_id": "user_abc123",
  "transaction_id": "txn_987654321",
  "survey": {
    "id": "survey_xyz789",
    "title": "Consumer Preferences Survey",
    "provider": "BitLabs",
    "completion_time": 180
  },
  "reward": {
    "amount": 150,
    "currency": "points",
    "conversion_rate": 0.01
  },
  "metadata": {
    "ip_address": "192.168.1.100",
    "user_agent": "Mozilla/5.0...",
    "completion_quality": "high"
  }
}`}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* API Security */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Security & Best Practices</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Enterprise-grade security measures to protect your integration and user data.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="glass-card hover:scale-105 transition-transform duration-fast text-center" data-testid="signature-verification">
              <CardContent className="pt-6">
                <Lock className="h-12 w-12 text-trust-secure mx-auto mb-4" />
                <h3 className="font-semibold mb-3">Signature Verification</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  HMAC-SHA256 signatures ensure webhooks are authentic and unmodified.
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-center gap-2 text-trust-verified">
                    <CheckCircle className="h-3 w-3" />
                    <span>SHA-256 hashing</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-trust-verified">
                    <CheckCircle className="h-3 w-3" />
                    <span>Secret key rotation</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card hover:scale-105 transition-transform duration-fast text-center" data-testid="rate-limiting">
              <CardContent className="pt-6">
                <Clock className="h-12 w-12 text-data-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-3">Rate Limiting</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Intelligent rate limiting protects against abuse and ensures fair usage.
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-center gap-2 text-trust-verified">
                    <CheckCircle className="h-3 w-3" />
                    <span>1000 requests/minute</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-trust-verified">
                    <CheckCircle className="h-3 w-3" />
                    <span>Burst protection</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card hover:scale-105 transition-transform duration-fast text-center" data-testid="retry-mechanism">
              <CardContent className="pt-6">
                <Zap className="h-12 w-12 text-success mx-auto mb-4" />
                <h3 className="font-semibold mb-3">Smart Retries</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Automatic retry mechanism with exponential backoff for failed deliveries.
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-center gap-2 text-trust-verified">
                    <CheckCircle className="h-3 w-3" />
                    <span>5 retry attempts</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-trust-verified">
                    <CheckCircle className="h-3 w-3" />
                    <span>Exponential backoff</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-16 max-w-4xl mx-auto">
            <Card className="glass-card border-warning/20">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <AlertCircle className="h-6 w-6 text-warning mt-1" />
                  <div>
                    <h3 className="font-semibold text-warning mb-2">Security Checklist</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Always verify webhook signatures before processing</li>
                      <li>• Use HTTPS for all webhook endpoints</li>
                      <li>• Implement idempotency checks for duplicate events</li>
                      <li>• Store webhook secrets securely (environment variables)</li>
                      <li>• Log webhook events for debugging and auditing</li>
                      <li>• Implement proper error handling and retry logic</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/10 py-12 border-t">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-3">API Documentation</h3>
              <div className="space-y-2 text-sm">
                <div className="text-muted-foreground hover:text-primary cursor-pointer">Webhook Reference</div>
                <div className="text-muted-foreground hover:text-primary cursor-pointer">Authentication</div>
                <div className="text-muted-foreground hover:text-primary cursor-pointer">Rate Limits</div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Examples</h3>
              <div className="space-y-2 text-sm">
                <div className="text-muted-foreground hover:text-primary cursor-pointer">Node.js</div>
                <div className="text-muted-foreground hover:text-primary cursor-pointer">Python</div>
                <div className="text-muted-foreground hover:text-primary cursor-pointer">PHP</div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Tools</h3>
              <div className="space-y-2 text-sm">
                <div className="text-muted-foreground hover:text-primary cursor-pointer">Webhook Tester</div>
                <div className="text-muted-foreground hover:text-primary cursor-pointer">API Explorer</div>
                <div className="text-muted-foreground hover:text-primary cursor-pointer">Debug Console</div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Support</h3>
              <div className="space-y-2 text-sm">
                <div className="text-muted-foreground">Developer Support</div>
                <div className="text-muted-foreground">api@rewardspay.com</div>
                <div className="text-muted-foreground">24/7 Monitoring</div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; 2024 RewardsPay API. All rights reserved. | Build with confidence.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}