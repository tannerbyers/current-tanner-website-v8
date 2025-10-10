"""
Business Metrics Tracking and Analysis System
Tracks all key metrics for autonomous business building toward $500K/year target
"""

import os
import json
import time
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any, Tuple
from dataclasses import dataclass, asdict
from enum import Enum
from notion_client import Client as NotionClient
from notion_client.errors import APIResponseError
import yaml
import requests

logger = logging.getLogger(__name__)


class MetricType(Enum):
    REVENUE = "revenue"
    GROWTH = "growth"
    ACQUISITION = "acquisition"
    RETENTION = "retention"
    OPERATIONAL = "operational"
    MARKET = "market"
    EXPERIMENT = "experiment"


class MetricFrequency(Enum):
    REAL_TIME = "real_time"
    HOURLY = "hourly"
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"


@dataclass
class BusinessMetric:
    """Individual business metric data point"""
    id: str
    name: str
    type: MetricType
    value: float
    target_value: Optional[float]
    timestamp: str
    frequency: MetricFrequency
    source: str
    metadata: Dict[str, Any]
    trend_direction: str  # "up", "down", "stable"
    variance_from_target: Optional[float]


@dataclass
class BusinessOpportunity:
    """Tracked business opportunity/model being evaluated"""
    id: str
    name: str
    category: str
    description: str
    score: float
    validation_stage: str  # "research", "mvp", "testing", "scaling", "mature"
    metrics: Dict[str, float]
    experiments_run: List[str]
    created_date: str
    last_updated: str
    status: str  # "active", "paused", "killed", "graduated"


@dataclass
class ExperimentResult:
    """Results from business model validation experiments"""
    id: str
    opportunity_id: str
    name: str
    hypothesis: str
    duration_days: int
    budget_spent: float
    results: Dict[str, Any]
    success_criteria_met: bool
    lessons_learned: List[str]
    next_actions: List[str]
    completed_date: str


class BusinessMetricsTracker:
    """
    Comprehensive business metrics tracking system for autonomous revenue generation
    """
    
    def __init__(self, notion_client: NotionClient, metrics_db_id: str, opportunities_db_id: str = None):
        self.notion = notion_client
        self.metrics_db_id = metrics_db_id
        self.opportunities_db_id = opportunities_db_id or metrics_db_id
        
        # Load business model discovery config
        self.discovery_config = self._load_discovery_config()
        
        # In-memory caches for real-time metrics
        self.metrics_cache: Dict[str, BusinessMetric] = {}
        self.opportunities_cache: Dict[str, BusinessOpportunity] = {}
        
        # Performance tracking
        self.performance_history: List[Dict] = []
        
    def _load_discovery_config(self) -> Dict:
        """Load business model discovery configuration"""
        try:
            config_path = "/Users/naultic/workplace/decouple-dev-ai-assistant/business_model_discovery.yaml"
            if os.path.exists(config_path):
                with open(config_path, 'r') as f:
                    return yaml.safe_load(f)
            return {}
        except Exception as e:
            logger.error(f"Failed to load discovery config: {e}")
            return {}
    
    def track_metric(self, name: str, value: float, metric_type: MetricType, 
                    source: str = "system", metadata: Dict = None, 
                    target_value: float = None, frequency: MetricFrequency = MetricFrequency.DAILY) -> str:
        """
        Track a business metric
        
        Args:
            name: Metric name (e.g., "monthly_revenue", "customer_acquisition_cost")
            value: Current metric value
            metric_type: Type of metric (revenue, growth, etc.)
            source: Source of the metric data
            metadata: Additional context data
            target_value: Target value for this metric
            frequency: How often this metric should be tracked
            
        Returns:
            Metric ID
        """
        metric_id = f"{name}_{int(time.time())}"
        timestamp = datetime.now().isoformat()
        
        # Calculate variance from target if available
        variance = None
        if target_value and target_value > 0:
            variance = ((value - target_value) / target_value) * 100
        
        # Determine trend direction based on recent history
        trend = self._calculate_trend(name, value)
        
        metric = BusinessMetric(
            id=metric_id,
            name=name,
            type=metric_type,
            value=value,
            target_value=target_value,
            timestamp=timestamp,
            frequency=frequency,
            source=source,
            metadata=metadata or {},
            trend_direction=trend,
            variance_from_target=variance
        )
        
        # Cache metric
        self.metrics_cache[metric_id] = metric
        
        # Store in Notion (skip if no valid database)
        if self.metrics_db_id and self.metrics_db_id != "temp_metrics_db":
            try:
                self._store_metric_in_notion(metric)
            except Exception as e:
                logger.warning(f"Failed to store metric in Notion (continuing): {e}")
        else:
            logger.debug(f"Skipping Notion storage - database not configured")
        
        # Trigger analysis if it's a critical metric
        if self._is_critical_metric(name, metric_type):
            self._trigger_performance_analysis()
        
        logger.info(f"Tracked metric: {name} = {value} (target: {target_value})")
        return metric_id
    
    def track_opportunity(self, name: str, category: str, description: str, 
                         initial_score: float = 0.0) -> str:
        """
        Start tracking a new business opportunity
        
        Args:
            name: Opportunity name
            category: Business model category
            description: Detailed description
            initial_score: Initial evaluation score (0-100)
            
        Returns:
            Opportunity ID
        """
        opportunity_id = f"opp_{name.lower().replace(' ', '_')}_{int(time.time())}"
        timestamp = datetime.now().isoformat()
        
        opportunity = BusinessOpportunity(
            id=opportunity_id,
            name=name,
            category=category,
            description=description,
            score=initial_score,
            validation_stage="research",
            metrics={},
            experiments_run=[],
            created_date=timestamp,
            last_updated=timestamp,
            status="active"
        )
        
        # Cache opportunity
        self.opportunities_cache[opportunity_id] = opportunity
        
        # Store in Notion (skip if no valid database)
        if self.opportunities_db_id and self.opportunities_db_id != "temp_metrics_db":
            try:
                self._store_opportunity_in_notion(opportunity)
            except Exception as e:
                logger.warning(f"Failed to store opportunity in Notion (continuing): {e}")
        else:
            logger.debug(f"Skipping Notion opportunity storage - database not configured")
        
        logger.info(f"Started tracking opportunity: {name} ({category})")
        return opportunity_id
    
    def update_opportunity_score(self, opportunity_id: str, new_score: float, 
                               validation_data: Dict = None) -> bool:
        """
        Update opportunity evaluation score based on new data
        
        Args:
            opportunity_id: ID of the opportunity
            new_score: New evaluation score (0-100)
            validation_data: Additional validation data
            
        Returns:
            Success boolean
        """
        if opportunity_id not in self.opportunities_cache:
            logger.error(f"Opportunity {opportunity_id} not found")
            return False
        
        opportunity = self.opportunities_cache[opportunity_id]
        opportunity.score = new_score
        opportunity.last_updated = datetime.now().isoformat()
        
        if validation_data:
            opportunity.metrics.update(validation_data)
        
        # Update validation stage based on score
        if new_score >= 80:
            opportunity.validation_stage = "scaling"
        elif new_score >= 60:
            opportunity.validation_stage = "testing"
        elif new_score >= 40:
            opportunity.validation_stage = "mvp"
        else:
            opportunity.validation_stage = "research"
        
        # Update in Notion
        try:
            self._update_opportunity_in_notion(opportunity)
        except Exception as e:
            logger.error(f"Failed to update opportunity in Notion: {e}")
            return False
        
        logger.info(f"Updated opportunity {opportunity.name} score to {new_score}")
        return True
    
    def record_experiment_result(self, opportunity_id: str, experiment_name: str,
                               hypothesis: str, duration_days: int, budget_spent: float,
                               results: Dict, success_criteria_met: bool,
                               lessons_learned: List[str] = None,
                               next_actions: List[str] = None) -> str:
        """
        Record the results of a business model validation experiment
        
        Args:
            opportunity_id: Associated opportunity ID
            experiment_name: Name of the experiment
            hypothesis: What was being tested
            duration_days: How long the experiment ran
            budget_spent: Money spent on the experiment
            results: Experiment results data
            success_criteria_met: Whether success criteria were met
            lessons_learned: Key insights from the experiment
            next_actions: Recommended follow-up actions
            
        Returns:
            Experiment result ID
        """
        experiment_id = f"exp_{experiment_name.lower().replace(' ', '_')}_{int(time.time())}"
        
        experiment = ExperimentResult(
            id=experiment_id,
            opportunity_id=opportunity_id,
            name=experiment_name,
            hypothesis=hypothesis,
            duration_days=duration_days,
            budget_spent=budget_spent,
            results=results,
            success_criteria_met=success_criteria_met,
            lessons_learned=lessons_learned or [],
            next_actions=next_actions or [],
            completed_date=datetime.now().isoformat()
        )
        
        # Update opportunity with experiment data
        if opportunity_id in self.opportunities_cache:
            opportunity = self.opportunities_cache[opportunity_id]
            opportunity.experiments_run.append(experiment_id)
            
            # Adjust score based on experiment success
            score_adjustment = 10 if success_criteria_met else -5
            new_score = min(100, max(0, opportunity.score + score_adjustment))
            self.update_opportunity_score(opportunity_id, new_score, results)
        
        # Store experiment in Notion
        try:
            self._store_experiment_in_notion(experiment)
        except Exception as e:
            logger.error(f"Failed to store experiment in Notion: {e}")
        
        logger.info(f"Recorded experiment result: {experiment_name} (Success: {success_criteria_met})")
        return experiment_id
    
    def get_performance_dashboard(self) -> Dict[str, Any]:
        """
        Generate comprehensive performance dashboard data
        
        Returns:
            Dashboard data with current metrics, trends, and recommendations
        """
        dashboard = {
            "timestamp": datetime.now().isoformat(),
            "target_revenue": self.discovery_config.get("business_model_discovery", {}).get("target_revenue", 500000),
            "current_metrics": {},
            "opportunities": {},
            "experiments": {},
            "recommendations": [],
            "alerts": []
        }
        
        # Current key metrics
        revenue_metrics = [m for m in self.metrics_cache.values() if m.type == MetricType.REVENUE]
        if revenue_metrics:
            latest_revenue = max(revenue_metrics, key=lambda x: x.timestamp)
            dashboard["current_metrics"]["monthly_revenue"] = latest_revenue.value
            dashboard["current_metrics"]["annual_run_rate"] = latest_revenue.value * 12
            dashboard["current_metrics"]["progress_to_target"] = (latest_revenue.value * 12) / dashboard["target_revenue"]
        
        # Top opportunities
        active_opportunities = [o for o in self.opportunities_cache.values() if o.status == "active"]
        dashboard["opportunities"] = {
            "total_active": len(active_opportunities),
            "top_3": sorted(active_opportunities, key=lambda x: x.score, reverse=True)[:3],
            "by_stage": self._group_by_validation_stage(active_opportunities)
        }
        
        # Recent experiments
        experiment_data = self._get_recent_experiments()
        dashboard["experiments"] = {
            "total_run": len(experiment_data),
            "success_rate": sum(1 for e in experiment_data if e.success_criteria_met) / max(1, len(experiment_data)),
            "recent_5": experiment_data[:5]
        }
        
        # Generate recommendations
        dashboard["recommendations"] = self._generate_recommendations()
        
        # Generate alerts
        dashboard["alerts"] = self._generate_alerts()
        
        return dashboard
    
    def analyze_revenue_trajectory(self) -> Dict[str, Any]:
        """
        Analyze current revenue trajectory toward $500K/year target
        
        Returns:
            Analysis including projections, required growth rates, and timeline
        """
        revenue_metrics = [m for m in self.metrics_cache.values() if m.type == MetricType.REVENUE]
        if not revenue_metrics:
            return {"error": "No revenue metrics available"}
        
        # Sort by timestamp
        revenue_metrics.sort(key=lambda x: x.timestamp)
        
        current_monthly = revenue_metrics[-1].value if revenue_metrics else 0
        target_annual = 500000
        target_monthly = target_annual / 12  # ~$41,667
        
        # Calculate required growth rate
        months_to_target = 12  # Assume 1-year timeline
        if current_monthly > 0:
            required_monthly_growth = (target_monthly / current_monthly) ** (1/months_to_target) - 1
        else:
            required_monthly_growth = float('inf')
        
        # Historical growth rate (if enough data)
        growth_rate = 0
        if len(revenue_metrics) >= 2:
            old_revenue = revenue_metrics[-2].value
            if old_revenue > 0:
                growth_rate = (current_monthly - old_revenue) / old_revenue
        
        # Project timeline to target
        projected_months = float('inf')
        if current_monthly > 0 and growth_rate > 0:
            projected_months = (target_monthly / current_monthly) / growth_rate
        
        return {
            "current_monthly_revenue": current_monthly,
            "current_annual_run_rate": current_monthly * 12,
            "target_annual_revenue": target_annual,
            "target_monthly_revenue": target_monthly,
            "revenue_gap": target_monthly - current_monthly,
            "progress_percentage": (current_monthly / target_monthly) * 100,
            "required_monthly_growth_rate": required_monthly_growth * 100,
            "current_monthly_growth_rate": growth_rate * 100,
            "projected_months_to_target": projected_months,
            "on_track": growth_rate >= required_monthly_growth if required_monthly_growth != float('inf') else False
        }
    
    def _calculate_trend(self, metric_name: str, current_value: float) -> str:
        """Calculate trend direction for a metric"""
        # Look for recent metrics with same name
        recent_metrics = [
            m for m in self.metrics_cache.values() 
            if m.name == metric_name and 
            datetime.fromisoformat(m.timestamp) > (datetime.now() - timedelta(days=7))
        ]
        
        if len(recent_metrics) < 2:
            return "stable"
        
        # Sort by timestamp and compare last two values
        recent_metrics.sort(key=lambda x: x.timestamp)
        prev_value = recent_metrics[-2].value
        
        if current_value > prev_value * 1.05:  # 5% increase threshold
            return "up"
        elif current_value < prev_value * 0.95:  # 5% decrease threshold
            return "down"
        else:
            return "stable"
    
    def _is_critical_metric(self, name: str, metric_type: MetricType) -> bool:
        """Determine if a metric is critical and requires immediate analysis"""
        critical_metrics = ["monthly_revenue", "customer_acquisition_cost", "churn_rate", "conversion_rate"]
        critical_types = [MetricType.REVENUE, MetricType.GROWTH]
        
        return name in critical_metrics or metric_type in critical_types
    
    def _trigger_performance_analysis(self):
        """Trigger automated performance analysis"""
        # This would trigger the business plan refinement engine
        logger.info("Triggering performance analysis due to critical metric update")
        # TODO: Implement connection to refinement engine
    
    def _store_metric_in_notion(self, metric: BusinessMetric):
        """Store metric in Notion database"""
        try:
            properties = {
                "Name": {"title": [{"text": {"content": f"{metric.name} - {metric.timestamp}"}}]},
                "Metric Name": {"rich_text": [{"text": {"content": metric.name}}]},
                "Type": {"select": {"name": metric.type.value}},
                "Value": {"number": metric.value},
                "Timestamp": {"date": {"start": metric.timestamp}},
                "Source": {"rich_text": [{"text": {"content": metric.source}}]},
                "Trend": {"select": {"name": metric.trend_direction}}
            }
            
            if metric.target_value:
                properties["Target Value"] = {"number": metric.target_value}
                
            if metric.variance_from_target:
                properties["Variance %"] = {"number": metric.variance_from_target}
            
            self.notion.pages.create(
                parent={"database_id": self.metrics_db_id},
                properties=properties
            )
        except Exception as e:
            logger.error(f"Failed to store metric in Notion: {e}")
            raise
    
    def _store_opportunity_in_notion(self, opportunity: BusinessOpportunity):
        """Store opportunity in Notion database"""
        try:
            properties = {
                "Name": {"title": [{"text": {"content": opportunity.name}}]},
                "Category": {"select": {"name": opportunity.category}},
                "Description": {"rich_text": [{"text": {"content": opportunity.description}}]},
                "Score": {"number": opportunity.score},
                "Stage": {"select": {"name": opportunity.validation_stage}},
                "Status": {"select": {"name": opportunity.status}},
                "Created": {"date": {"start": opportunity.created_date}},
                "Last Updated": {"date": {"start": opportunity.last_updated}}
            }
            
            self.notion.pages.create(
                parent={"database_id": self.opportunities_db_id},
                properties=properties
            )
        except Exception as e:
            logger.error(f"Failed to store opportunity in Notion: {e}")
            raise
    
    def _update_opportunity_in_notion(self, opportunity: BusinessOpportunity):
        """Update opportunity in Notion database"""
        # For now, we'll create a new entry (in production, you'd search and update)
        self._store_opportunity_in_notion(opportunity)
    
    def _store_experiment_in_notion(self, experiment: ExperimentResult):
        """Store experiment result in Notion database"""
        try:
            properties = {
                "Name": {"title": [{"text": {"content": experiment.name}}]},
                "Hypothesis": {"rich_text": [{"text": {"content": experiment.hypothesis}}]},
                "Duration (Days)": {"number": experiment.duration_days},
                "Budget Spent": {"number": experiment.budget_spent},
                "Success": {"checkbox": experiment.success_criteria_met},
                "Completed": {"date": {"start": experiment.completed_date}}
            }
            
            self.notion.pages.create(
                parent={"database_id": self.opportunities_db_id},
                properties=properties
            )
        except Exception as e:
            logger.error(f"Failed to store experiment in Notion: {e}")
            raise
    
    def _group_by_validation_stage(self, opportunities: List[BusinessOpportunity]) -> Dict:
        """Group opportunities by validation stage"""
        stages = {}
        for opp in opportunities:
            stage = opp.validation_stage
            if stage not in stages:
                stages[stage] = []
            stages[stage].append(opp)
        return stages
    
    def _get_recent_experiments(self) -> List[ExperimentResult]:
        """Get recent experiment results (mock data for now)"""
        # TODO: Implement actual experiment tracking
        return []
    
    def _generate_recommendations(self) -> List[str]:
        """Generate business recommendations based on current metrics"""
        recommendations = []
        
        # Analyze revenue trajectory
        trajectory = self.analyze_revenue_trajectory()
        
        if trajectory.get("progress_percentage", 0) < 10:
            recommendations.append("Focus on finding and validating your first revenue stream")
            recommendations.append("Consider starting with a service-based model for faster revenue")
        elif trajectory.get("progress_percentage", 0) < 50:
            recommendations.append("Scale current revenue streams and optimize conversion")
            recommendations.append("Experiment with pricing and customer acquisition channels")
        else:
            recommendations.append("Focus on retention and expanding average customer value")
            recommendations.append("Consider adding complementary revenue streams")
        
        # Check opportunity pipeline
        active_opportunities = [o for o in self.opportunities_cache.values() if o.status == "active"]
        if len(active_opportunities) < 3:
            recommendations.append("Research and evaluate more business opportunities")
        
        return recommendations
    
    def _generate_alerts(self) -> List[Dict]:
        """Generate business alerts based on current performance"""
        alerts = []
        
        # Revenue alerts
        trajectory = self.analyze_revenue_trajectory()
        if not trajectory.get("on_track", False) and trajectory.get("current_monthly_revenue", 0) > 0:
            alerts.append({
                "type": "warning",
                "message": f"Revenue growth rate ({trajectory.get('current_monthly_growth_rate', 0):.1f}%) below required rate ({trajectory.get('required_monthly_growth_rate', 0):.1f}%)",
                "action": "Review and optimize customer acquisition and retention strategies"
            })
        
        # Opportunity pipeline alerts  
        active_opportunities = [o for o in self.opportunities_cache.values() if o.status == "active"]
        high_score_opportunities = [o for o in active_opportunities if o.score > 70]
        
        if not high_score_opportunities:
            alerts.append({
                "type": "warning", 
                "message": "No high-scoring opportunities in pipeline",
                "action": "Conduct market research to identify new promising opportunities"
            })
        
        return alerts


# Initialize global metrics tracker (will be set by main app)
_metrics_tracker = None

def get_metrics_tracker() -> Optional[BusinessMetricsTracker]:
    """Get the global metrics tracker instance"""
    return _metrics_tracker

def initialize_metrics_tracker(notion_client: NotionClient, metrics_db_id: str, opportunities_db_id: str = None):
    """Initialize the global metrics tracker"""
    global _metrics_tracker
    _metrics_tracker = BusinessMetricsTracker(notion_client, metrics_db_id, opportunities_db_id)
    logger.info("Business metrics tracker initialized")
    return _metrics_tracker